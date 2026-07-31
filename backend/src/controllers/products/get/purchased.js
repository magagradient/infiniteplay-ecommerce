const { Orders, OrdersProducts } = require("../../../database/indexModels");
const { successResponse, errorResponse } = require("../../../utils/responseHelper");

const purchased = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Orders.findOne({
          where: { id_user: req.user.id_user, status: "paid" },
          include: [{
              model: OrdersProducts,
              as: "orderDetails",
              where: { id_product: id },
              required: true,
          }],
      });

        return successResponse(res, { purchased: !!order }, "products/purchased");
    } catch (error) {
        console.error("Error al chequear compra del producto:", error);
        return errorResponse(res, "server_error", "Error interno del servidor.", "products/purchased", 500);
    }
};

module.exports = purchased;