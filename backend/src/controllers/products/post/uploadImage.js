const fs = require("fs");
const path = require("path");
const os = require("os");
const sharp = require("sharp");
const cloudinary = require("../../../../config/cloudinary");
const { Products, ProductImages, ProductTechnicalDetails } = require("../../../database/indexModels");
const { successResponse, errorResponse } = require("../../../utils/responseHelper");
const processImage = require("../../../utils/processImage");

// Detalles técnicos que se calculan solos a partir del archivo, no se cargan a mano.
// sort_order bajo para que aparezcan primero, antes de los detalles manuales que agregue el admin.
const AUTO_DETAIL_SORT_ORDER = {
  "Resolución": 0,
  "Formato": 1,
  "Peso": 2,
};

async function upsertAutoDetail(id_product, label, value) {
  const [detail, created] = await ProductTechnicalDetails.findOrCreate({
    where: { id_product, label },
    defaults: {
      value,
      is_visible: true,
      sort_order: AUTO_DETAIL_SORT_ORDER[label] ?? 0,
    },
  });

  if (!created) {
    detail.value = value;
    await detail.save();
  }
}

const uploadImage = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;

  if (!req.file) {
    return errorResponse(res, "bad_request", "No se subió ninguna imagen.", "products/uploadImage", 400);
  }

  let tempCleanPath = null;
  let tempWatermarkPath = null;

  try {
    console.log("🟡 req.body:", req.body);
    console.log("🟡 req.file:", req.file);
    const product = await Products.findByPk(id);

    if (!product) {
      fs.unlinkSync(req.file.path);
      return errorResponse(res, "not_found", "Producto no encontrado.", "products/uploadImage", 404);
    }

    // Leer metadata del archivo original antes de procesarlo/subirlo
    const metadata = await sharp(req.file.path).metadata();
    const fileSizeBytes = fs.statSync(req.file.path).size;
    const fileSizeMB = (fileSizeBytes / (1024 * 1024)).toFixed(1);

    // subir original a cloudinary carpeta privada
    await cloudinary.uploader.upload(req.file.path, {
      folder: `products/originals/${id}`,
      access_mode: "authenticated",
    });

    // generar versiones clean y watermark
    const { cleanBuffer, watermarkBuffer } = await processImage(req.file.path, type || "cover");

    // guardar en archivos temporales
    tempCleanPath = path.join(os.tmpdir(), `clean-${Date.now()}.jpg`);
    tempWatermarkPath = path.join(os.tmpdir(), `watermark-${Date.now()}.jpg`);
    fs.writeFileSync(tempCleanPath, cleanBuffer);
    fs.writeFileSync(tempWatermarkPath, watermarkBuffer);

    // subir clean a cloudinary
    const cleanResult = await cloudinary.uploader.upload(tempCleanPath, {
      folder: `products/previews/${id}`,
    });

    // subir watermark a cloudinary
    const watermarkResult = await cloudinary.uploader.upload(tempWatermarkPath, {
      folder: `products/watermarks/${id}`,
    });

    // borrar todos los temporales
    fs.unlinkSync(req.file.path);
    fs.unlinkSync(tempCleanPath);
    fs.unlinkSync(tempWatermarkPath);

    // guardar en ProductImages
    const image = await ProductImages.create({
      id_product: product.id_product,
      image_url: cleanResult.secure_url,
      watermark_url: watermarkResult.secure_url,
      image_type: type || "cover",
    });

    // Crear/actualizar los detalles técnicos automáticos, solo para la imagen "cover"
    // (una imagen banner o secundaria no debería pisar la ficha técnica principal del producto)
    if ((type || "cover") === "cover") {
      await upsertAutoDetail(product.id_product, "Resolución", `${metadata.width}x${metadata.height}px`);
      await upsertAutoDetail(product.id_product, "Formato", metadata.format?.toUpperCase() || "N/A");
      await upsertAutoDetail(product.id_product, "Peso", `${fileSizeMB} MB`);
    }

    return successResponse(res, { image }, "products/uploadImage");

  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    if (tempCleanPath && fs.existsSync(tempCleanPath)) fs.unlinkSync(tempCleanPath);
    if (tempWatermarkPath && fs.existsSync(tempWatermarkPath)) fs.unlinkSync(tempWatermarkPath);
    console.error("🔴 ERROR:", error.message);
    return errorResponse(res, "server_error", "Error al subir la imagen.", "products/uploadImage", 500);
  }
};

module.exports = uploadImage;