const { ProductTechnicalDetails } = require("../../../database/indexModels");
const { successResponse, errorResponse } = require("../../../utils/responseHelper");

const update = async (req, res) => {
    try {
        const { id_detail } = req.params;
        const { label, value, is_visible, sort_order } = req.body;

        const detail = await ProductTechnicalDetails.findByPk(id_detail);
        if (!detail) {
            return errorResponse(res, "not_found", "Detalle técnico no encontrado.", "admin_updateTechnicalDetail", 404);
        }

        if (label !== undefined) detail.label = label;
        if (value !== undefined) detail.value = value;
        if (is_visible !== undefined) detail.is_visible = is_visible;
        if (sort_order !== undefined) detail.sort_order = sort_order;

        await detail.save();

        return successResponse(res, detail, "admin_updateTechnicalDetail");
    } catch (error) {
        console.error("🔴 Error admin updateTechnicalDetail:", error);
        return errorResponse(res, "server_error", "Error interno del servidor.", "admin_updateTechnicalDetail", 500);
    }
};

module.exports = update;