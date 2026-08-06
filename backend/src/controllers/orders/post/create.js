const { Orders } = require("../../../database/indexModels");
const responseHelper = require("../../../utils/responseHelper");

const create = async (req, res) => {
    try {
        const { id_user, subtotal, discount_total, total, status } = req.body;

        const newOrder = await Orders.create({
            id_user,
            subtotal,
            discount_total: discount_total || 0,
            total,
            status: status || "pending",
        });

        return responseHelper.successResponse(res, newOrder, "orders_create", 201);
    } catch (error) {
        console.error("Error creating order:", error);
        return responseHelper.errorResponse(res, "server_error", error.message, "orders_create", 500);
    }
};

module.exports = create;