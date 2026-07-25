const { ProductIncludedResources } = require("../../../database/indexModels");
const { successResponse, errorResponse } = require("../../../utils/responseHelper");

const remove = async (req, res) => {
    try {
        const { id_resource } = req.params;

        const resource = await ProductIncludedResources.findByPk(id_resource);
        if (!resource) {
            return errorResponse(res, "not_found", "Recurso incluido no encontrado.", "admin_deleteIncludedResource", 404);
        }

        await resource.destroy();

        return successResponse(res, { id_resource }, "admin_deleteIncludedResource");
    } catch (error) {
        console.error("🔴 Error admin deleteIncludedResource:", error);
        return errorResponse(res, "server_error", "Error interno del servidor.", "admin_deleteIncludedResource", 500);
    }
};

module.exports = remove;