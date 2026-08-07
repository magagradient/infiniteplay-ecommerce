const { Coupons } = require("../../../database/indexModels");
const responseHelper = require('../../../utils/responseHelper');

const create = async (req, res) => {
    const { code, discount, discount_type, expiration_date, max_uses, type } = req.body;

    try {
        if (!code || !discount || !expiration_date || !type) {
            return responseHelper.errorResponse(res, "missing_fields", "Faltan campos obligatorios.", "coupons_create", 400);
        }

        if (discount <= 0) {
            return responseHelper.errorResponse(res, "invalid_discount", "El descuento debe ser mayor a 0.", "coupons_create", 400);
        }

        if (discount_type === 'percentage' && discount > 100) {
            return responseHelper.errorResponse(res, "invalid_discount", "Un descuento porcentual no puede superar 100.", "coupons_create", 400);
        }

        const newCoupon = await Coupons.create({
            code,
            discount,
            discount_type: discount_type || 'fixed',
            expiration_date,
            max_uses: max_uses || null,
            type,
        });

        return responseHelper.successResponse(res, newCoupon, "coupons_create");

    } catch (error) {
        console.error("Error al crear el cupón:", error);
        return responseHelper.errorResponse(res, "server_error", error.message, "coupons_create", 500);
    }
};

module.exports = create;