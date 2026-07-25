const { StudioResources } = require("../../../database/indexModels");
const { successResponse, errorResponse } = require("../../../utils/responseHelper");

const destroy = async (req, res) => {
    try {
        const { id } = req.params;

        const resource = await StudioResources.findByPk(id);

        if (!resource) {
            return errorResponse(res, "not_found", "Recurso no encontrado.", "studio/resources/destroy", 404);
        }

        await resource.destroy();

        return successResponse(res, { id_studio_resource: parseInt(id) }, "studio/resources/destroy");
    } catch (error) {
        console.error("Error al eliminar recurso del studio:", error);
        return errorResponse(res, "server_error", "Error interno del servidor.", "studio/resources/destroy", 500);
    }
};

module.exports = destroy;