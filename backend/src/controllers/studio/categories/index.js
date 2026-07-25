const { StudioCategories, StudioResources } = require("../../../database/indexModels");
const { successResponse, errorResponse } = require("../../../utils/responseHelper");

const index = async (req, res) => {
    try {
        const categories = await StudioCategories.findAll({
            include: [{
                model: StudioResources,
                as: "resources",
                attributes: ["id_studio_resource", "name", "url"],
            }],
            order: [["created_at", "ASC"]],
        });

        return successResponse(res, categories, "studio/categories");
    } catch (error) {
        console.error("Error al obtener categorías del studio:", error);
        return errorResponse(res, "server_error", "Error interno del servidor.", "studio/categories", 500);
    }
};

module.exports = index;