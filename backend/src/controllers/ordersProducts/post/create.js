const { OrdersProducts, Orders, Products } = require("../../../database/indexModels");
const responseHelper = require("../../../utils/responseHelper");

const create = async (req, res) => {
    const {
        id_order,
        id_product,
        quantity,
        unit_price,
        custom_title,
        custom_artist_name,
        event_date,
        event_location,
        custom_notes,
    } = req.body;

    try {
        // Verificar existencia de la orden
        const order = await Orders.findByPk(id_order);
        if (!order) {
            return responseHelper.errorResponse(
                res,
                "order_not_found",
                `La orden con id ${id_order} no existe.`,
                "ordersProducts_create",
                404
            );
        }

        // Verificar existencia del producto
        const product = await Products.findByPk(id_product);
        if (!product) {
            return responseHelper.errorResponse(
                res,
                "product_not_found",
                `El producto con id ${id_product} no existe.`,
                "ordersProducts_create",
                404
            );
        }

        // Si el producto requiere personalización, exigir al menos los campos que declara necesitar
        if (product.is_customizable) {
            const requiredFields = product.customization_fields || ["title", "artist"];
            const fieldMap = {
                title: custom_title,
                artist: custom_artist_name,
                date: event_date,
                location: event_location,
            };

            const missing = requiredFields.filter((f) => fieldMap[f] === undefined || fieldMap[f] === null || fieldMap[f] === "");

            if (missing.length > 0) {
                return responseHelper.errorResponse(
                    res,
                    "missing_customization_fields",
                    `Este producto requiere los siguientes datos: ${missing.join(", ")}.`,
                    "ordersProducts_create",
                    400
                );
            }
        }

        // Crear el registro
        const newRecord = await OrdersProducts.create({
            id_order,
            id_product,
            quantity: quantity || 1,
            unit_price,
            custom_title: custom_title || null,
            custom_artist_name: custom_artist_name || null,
            event_date: event_date || null,
            event_location: event_location || null,
            custom_notes: custom_notes || null,
            fulfillment_status: product.is_customizable ? "pending_customization" : "not_applicable",
        });

        return responseHelper.successResponse(res, newRecord, "ordersProducts_create", 201);

    } catch (error) {
        console.error("Error creating order-product record:", error);
        return responseHelper.errorResponse(
            res,
            "server_error",
            error.message,
            "ordersProducts_create",
            500
        );
    }
};

module.exports = create;