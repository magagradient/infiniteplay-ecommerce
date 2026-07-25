const { ProductIncludedResources, Categories } = require("../../../database/indexModels");
const { successResponse, errorResponse } = require("../../../utils/responseHelper");

const update = async (req, res) => {
    try {
        const { id_resource } = req.params;
        const { quantity } = req.body;

        const resource = await ProductIncludedResources.findByPk(id_resource);
        if (!resource) {
            return errorResponse(res, "not_found", "Recurso incluido no encontrado.", "admin_updateIncludedResource", 404);
        }

        if (quantity !== undefined) resource.quantity = quantity;
        await resource.save();

        const withCategory = await ProductIncludedResources.findByPk(resource.id_resource, {
            include: [{ model: Categories, as: "category", attributes: ["id_category", "name"] }],
        });

        return successResponse(res, withCategory, "admin_updateIncludedResource");
    } catch (error) {
        console.error("🔴 Error admin updateIncludedResource:", error);
        return errorResponse(res, "server_error", "Error interno del servidor.", "admin_updateIncludedResource", 500);
    }
};

module.exports = update;