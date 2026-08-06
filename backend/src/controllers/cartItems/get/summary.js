const { CartItems, Products, SeriesDiscountRules } = require("../../../database/indexModels");
const responseHelper = require("../../../utils/responseHelper");

const cartSummary = async (req, res) => {
    const { id_cart } = req.query;

    if (!id_cart) {
        return responseHelper.errorResponse(
            res,
            "bad_request",
            "Falta el parámetro id_cart.",
            "cart_summary",
            400
        );
    }

    try {
        const items = await CartItems.findAll({
            where: { id_cart },
            include: {
                model: Products,
                as: "product",
                attributes: ["id_product", "title", "price", "id_series"],
            }
        });

        if (!items.length) {
            return responseHelper.successResponse(res, {
                total_items: 0,
                subtotal: 0,
                discounts: 0,
                total: 0,
                products: []
            }, "cart_summary");
        }

        let subtotal = 0;
        let totalItems = 0;
        const products = [];
        const piecesBySeries = {};

        items.forEach(item => {
            const itemPrice = item.product?.price || 0;
            subtotal += itemPrice * item.quantity;
            totalItems += item.quantity;

            const seriesId = item.product?.id_series;
            if (seriesId) {
                piecesBySeries[seriesId] = (piecesBySeries[seriesId] || 0) + item.quantity;
            }

            products.push({
                id_product: item.product.id_product,
                title: item.product.title,
                id_series: seriesId,
                quantity: item.quantity,
                unit_price: itemPrice,
                total_price: itemPrice * item.quantity,
                applied_discount_percentage: 0,
            });
        });

        const rules = await SeriesDiscountRules.findAll({
            where: { is_active: true },
            order: [["min_pieces", "DESC"]],
        });

        // Guarda qué % le corresponde a cada serie que tenga descuento aplicable
        const discountPercentageBySeries = {};

        Object.entries(piecesBySeries).forEach(([seriesId, count]) => {
            const applicableRule = rules.find((r) => count >= r.min_pieces);
            if (!applicableRule) return;
            discountPercentageBySeries[seriesId] = parseFloat(applicableRule.discount_percentage);
        });

        // Aplica el % correspondiente a cada línea de producto
        products.forEach((p) => {
            if (p.id_series && discountPercentageBySeries[p.id_series] !== undefined) {
                p.applied_discount_percentage = discountPercentageBySeries[p.id_series];
            }
        });

        let discounts = 0;
        Object.entries(piecesBySeries).forEach(([seriesId, count]) => {
            const percentage = discountPercentageBySeries[seriesId];
            if (percentage === undefined) return;

            const seriesSubtotal = products
                .filter((p) => p.id_series === parseInt(seriesId))
                .reduce((sum, p) => sum + p.total_price, 0);

            discounts += seriesSubtotal * (percentage / 100);
        });

        const roundedDiscounts = Math.round(discounts * 100) / 100;
        const total = Math.round((subtotal - roundedDiscounts) * 100) / 100;

        return responseHelper.successResponse(res, {
            total_items: totalItems,
            subtotal,
            discounts: roundedDiscounts,
            total,
            products
        }, "cart_summary");

    } catch (error) {
        console.error("Error al obtener resumen del carrito:", error);
        return responseHelper.errorResponse(
            res,
            "server_error",
            error.message,
            "cart_summary",
            500
        );
    }
};

module.exports = cartSummary;