const fs = require("fs");
const { Products, ProductImages } = require("../../../database/indexModels");
const { successResponse, errorResponse } = require("../../../utils/responseHelper");
const cloudinary = require("../../../../config/cloudinary");

const uploadImage = async (req, res) => {
    const { id } = req.params;
    const { type } = req.body;

    if (!req.file) {
        return errorResponse(res, "bad_request", "No se subió ninguna imagen.", "products/uploadImage", 400);
    }

    try {
        const product = await Products.findByPk(id);

        if (!product) {
            fs.unlinkSync(req.file.path);
            return errorResponse(res, "not_found", "Producto no encontrado.", "products/uploadImage", 404);
        }

        // subir a cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: `products/${id}`,
        });

        // borrar archivo temporal
        fs.unlinkSync(req.file.path);

        // guardar en ProductImages
        const image = await ProductImages.create({
            id_product: product.id_product,
            image_url: result.secure_url,
            image_type: type || "cover",
        });

        return successResponse(res, { image }, "products/uploadImage");

    } catch (error) {
        // borrar temporal si falla
        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        console.error("Error al subir imagen:", error);
        return errorResponse(res, "server_error", "Error al subir la imagen.", "products/uploadImage", 500);
    }
};

module.exports = uploadImage;