const { OrdersProducts } = require("../../../database/indexModels");
const { successResponse, errorResponse } = require("../../../utils/responseHelper");

const completeCustomization = async (req, res) => {
    try {
        const { id_order, id_product } = req.params;
        const { final_file_url } = req.body;

        if (!final_file_url) {
            return errorResponse(res, "bad_request", "Falta final_file_url.", "admin_completeCustomization", 400);
        }

        const item = await OrdersProducts.findOne({ where: { id_order, id_product } });

        if (!item) {
            return errorResponse(res, "not_found", "Item de orden no encontrado.", "admin_completeCustomization", 404);
        }

        if (item.fulfillment_status !== "pending_customization") {
            return errorResponse(
                res,
                "conflict",
                `Este item no está pendiente de personalización (estado actual: ${item.fulfillment_status}).`,
                "admin_completeCustomization",
                409
            );
        }

        await item.update({
            final_file_url,
            fulfillment_status: "ready",
        });

        return successResponse(res, item, "admin_completeCustomization");
    } catch (error) {
        console.error("🔴 Error admin completeCustomization:", error);
        return errorResponse(res, "server_error", "Error interno del servidor.", "admin_completeCustomization", 500);
    }
};

module.exports = completeCustomization;
