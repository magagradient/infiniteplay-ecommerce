const { StudioCategories } = require("../../../database/indexModels");
const { successResponse, errorResponse } = require("../../../utils/responseHelper");

const create = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return errorResponse(res, "bad_request", "El nombre es obligatorio.", "studio/categories/create", 400);
        }

        const category = await StudioCategories.create({ name: name.trim() });

        return successResponse(res, category, "studio/categories/create");
    } catch (error) {
        console.error("Error al crear categoría del studio:", error);
        return errorResponse(res, "server_error", "Error interno del servidor.", "studio/categories/create", 500);
    }
};

module.exports = create;