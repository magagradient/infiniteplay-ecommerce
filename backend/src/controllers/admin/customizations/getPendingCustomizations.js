const { OrdersProducts, Orders, Products, Users } = require("../../../database/indexModels");
const { successResponse, errorResponse } = require("../../../utils/responseHelper");

const getPendingCustomizations = async (req, res) => {
    try {
        const pendingItems = await OrdersProducts.findAll({
            where: { fulfillment_status: "pending_customization" },
            include: [
                {
                    model: Orders,
                    as: "order",
                    attributes: ["id_order", "order_date", "status"],
                    include: [
                        { model: Users, as: "user", attributes: ["id_user", "name", "email"] }
                    ]
                },
                {
                    model: Products,
                    as: "product",
                    attributes: ["id_product", "title", "customization_fields"]
                }
            ],
            order: [[{ model: Orders, as: "order" }, "order_date", "ASC"]]
        });

        return successResponse(res, pendingItems, "admin_getPendingCustomizations");
    } catch (error) {
        console.error("🔴 Error admin getPendingCustomizations:", error);
        return errorResponse(res, "server_error", "Error interno del servidor.", "admin_getPendingCustomizations", 500);
    }
};

module.exports = getPendingCustomizations;
