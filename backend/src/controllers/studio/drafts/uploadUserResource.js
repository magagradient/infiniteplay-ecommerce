const fs = require("fs");
const cloudinary = require("../../../../config/cloudinary");
const { successResponse, errorResponse } = require("../../../utils/responseHelper");

const uploadUserResource = async (req, res) => {
    try {
        if (!req.file) {
            return errorResponse(res, "bad_request", "No se subió ninguna imagen.", "studio/user-resources", 400);
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: `studio/user-resources/${req.user.id_user}`,
        });

        fs.unlinkSync(req.file.path);

        return successResponse(res, { url: result.secure_url }, "studio/user-resources");
    } catch (error) {
        if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        console.error("Error al subir recurso propio:", error);
        return errorResponse(res, "server_error", "Error interno del servidor.", "studio/user-resources", 500);
    }
};

module.exports = uploadUserResource;