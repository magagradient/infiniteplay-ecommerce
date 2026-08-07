const { Coupons } = require("../../../database/indexModels");
const responseHelper = require('../../../utils/responseHelper');

const update = async (req, res) => {
    const { id } = req.params;
    const { code, discount, discount_type, expiration_date, max_uses, is_active, type } = req.body;

    try {
        const coupon = await Coupons.findByPk(id);

        if (!coupon) {
            return responseHelper.errorResponse(res, "coupon_not_found", "Cupón no encontrado.", "coupons_update", 404);
        }

        if (code) {
            const existingCoupon = await Coupons.findOne({ where: { code } });
            if (existingCoupon && existingCoupon.id_coupon !== coupon.id_coupon) {
                return responseHelper.errorResponse(res, "coupon_code_exists", "El código del cupón ya está en uso.", "coupons_update", 400);
            }
        }

        const effectiveType = discount_type || coupon.discount_type;
        if (discount !== undefined) {
            if (discount <= 0) {
                return responseHelper.errorResponse(res, "invalid_discount", "El descuento debe ser mayor a 0.", "coupons_update", 400);
            }
            if (effectiveType === 'percentage' && discount > 100) {
                return responseHelper.errorResponse(res, "invalid_discount", "Un descuento porcentual no puede superar 100.", "coupons_update", 400);
            }
        }

        if (max_uses !== undefined && max_uses !== null && max_uses < coupon.current_uses) {
            return responseHelper.errorResponse(res, "invalid_max_uses", `Ya se usó ${coupon.current_uses} veces, no podés poner un máximo menor.`, "coupons_update", 400);
        }

        coupon.code = code || coupon.code;
        coupon.discount = discount ?? coupon.discount;
        coupon.discount_type = discount_type || coupon.discount_type;
        coupon.expiration_date = expiration_date || coupon.expiration_date;
        coupon.max_uses = max_uses !== undefined ? max_uses : coupon.max_uses;
        coupon.is_active = is_active !== undefined ? is_active : coupon.is_active;
        coupon.type = type || coupon.type;

        await coupon.save();

        return responseHelper.successResponse(res, coupon, "coupons_update");

    } catch (error) {
        console.error("Error al actualizar el cupón:", error);
        return responseHelper.errorResponse(res, "server_error", error.message, "coupons_update", 500);
    }
};

module.exports = update;