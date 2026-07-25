const fs = require("fs");
const { StudioResources, StudioCategories } = require("../../../database/indexModels");
const { successResponse, errorResponse } = require("../../../utils/responseHelper");
const cloudinary = require("../../../../config/cloudinary");

const create = async (req, res) => {
    try {
        const { name, id_studio_category } = req.body;

        if (!req.file) {
            return errorResponse(res, "bad_request", "No se subió ninguna imagen.", "studio/resources/create", 400);
        }

        if (!name || !id_studio_category) {
            fs.unlinkSync(req.file.path);
            return errorResponse(res, "bad_request", "Nombre y categoría son obligatorios.", "studio/resources/create", 400);
        }

        const category = await StudioCategories.findByPk(id_studio_category);
        if (!category) {
            fs.unlinkSync(req.file.path);
            return errorResponse(res, "not_found", "Categoría no encontrada.", "studio/resources/create", 404);
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: `studio/resources/${id_studio_category}`,
        });

        fs.unlinkSync(req.file.path);

        const resource = await StudioResources.create({
            name: name.trim(),
            url: result.secure_url,
            id_studio_category: parseInt(id_studio_category),
        });

        return successResponse(res, resource, "studio/resources/create");
    } catch (error) {
        if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        console.error("Error al crear recurso del studio:", error);
        return errorResponse(res, "server_error", "Error interno del servidor.", "studio/resources/create", 500);
    }
};

module.exports = create;