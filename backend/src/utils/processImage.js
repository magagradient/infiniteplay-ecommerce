const sharp = require("sharp");
const path = require("path");

const WATERMARK_PATH = path.join(__dirname, "../../uploads/watermark/logo.png");
const WATERMARK_OPACITY = 0.15;

const SIZES = {
  cover: { width: 800, height: 800 },
  banner: { width: 1200, height: 1400 },
};

const processImage = async (inputPath, imageType = "cover") => {
  const { width, height } = SIZES[imageType] || SIZES.cover;

  // generar versión limpia redimensionada
  const cleanBuffer = await sharp(inputPath)
    .resize(width, height, { fit: "inside", withoutEnlargement: true })
    .toBuffer();

  // obtener dimensiones reales del clean
  const cleanMeta = await sharp(cleanBuffer).metadata();
  const wmSize = Math.round(Math.min(cleanMeta.width, cleanMeta.height) * 0.3);

  // redimensionar marca de agua
  const watermarkBuffer = await sharp(WATERMARK_PATH)
    .resize(wmSize, wmSize, { fit: "inside" })
    .ensureAlpha()
    .linear(WATERMARK_OPACITY, 0)
    .toBuffer();

  // generar versión con marca de agua
  const watermarkBuffer2 = await sharp(cleanBuffer)
    .composite([{
      input: watermarkBuffer,
      gravity: "center",
      blend: "over",
    }])
    .toBuffer();

  return { cleanBuffer, watermarkBuffer: watermarkBuffer2 };
};

module.exports = processImage;