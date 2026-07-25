const { ProductTechnicalDetails } = require("../../../database/indexModels");
const { successResponse, errorResponse } = require("../../../utils/responseHelper");

const remove = async (req, res) => {
    try {
        const { id_detail } = req.params;

        const detail = await ProductTechnicalDetails.findByPk(id_detail);
        if (!detail) {
            return errorResponse(res, "not_found", "Detalle técnico no encontrado.", "admin_deleteTechnicalDetail", 404);
        }

        await detail.destroy();

        return successResponse(res, { id_detail }, "admin_deleteTechnicalDetail");
    } catch (error) {
        console.error("🔴 Error admin deleteTechnicalDetail:", error);
        return errorResponse(res, "server_error", "Error interno del servidor.", "admin_deleteTechnicalDetail", 500);
    }
};

module.exports = remove;