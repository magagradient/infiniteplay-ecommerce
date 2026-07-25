const { StudioCategories } = require("../../../database/indexModels");
const { successResponse, errorResponse } = require("../../../utils/responseHelper");

const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await StudioCategories.findByPk(id);

        if (!category) {
            return errorResponse(res, "not_found", "Categoría no encontrada.", "studio/categories/destroy", 404);
        }

        await category.destroy();

        return successResponse(res, { id_studio_category: parseInt(id) }, "studio/categories/destroy");
    } catch (error) {
        console.error("Error al eliminar categoría del studio:", error);
        return errorResponse(res, "server_error", "Error interno del servidor.", "studio/categories/destroy", 500);
    }
};

module.exports = destroy;