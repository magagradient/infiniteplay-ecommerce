const fs = require("fs");
const { StudioDrafts } = require("../../../database/indexModels");
const { successResponse, errorResponse } = require("../../../utils/responseHelper");
const cloudinary = require("../../../../config/cloudinary");

const create = async (req, res) => {
    try {
        const { name, format, elements, id_product } = req.body;

        if (!name || !format || !elements) {
            if (req.file?.path) fs.unlinkSync(req.file.path);
            return errorResponse(res, "bad_request", "Nombre, formato y elementos son obligatorios.", "studio/drafts/create", 400);
        }

        let background_image_url = req.body.background_image_url || null;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: `studio/drafts/${req.user.id_user}`,
            });
            fs.unlinkSync(req.file.path);
            background_image_url = result.secure_url;
        }

        const draft = await StudioDrafts.create({
            id_user: req.user.id_user,
            name: name.trim(),
            format,
            elements: JSON.parse(elements),
            background_image_url,
            id_product: id_product ? parseInt(id_product) : null,
        });

        return successResponse(res, draft, "studio/drafts/create");
    } catch (error) {
        if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        console.error("Error al crear borrador del studio:", error);
        return errorResponse(res, "server_error", "Error interno del servidor.", "studio/drafts/create", 500);
    }
};

module.exports = create;