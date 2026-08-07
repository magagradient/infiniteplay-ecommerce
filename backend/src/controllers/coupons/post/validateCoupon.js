const { Coupons, UserCoupons } = require("../../../database/indexModels");
const responseHelper = require('../../../utils/responseHelper');

const validateCoupon = async (req, res) => {
    const { code, id_user } = req.body;

    try {
        const coupon = await Coupons.findOne({ where: { code } });

        if (!coupon) {
            return responseHelper.errorResponse(res, "coupon_not_found", "Cupón no válido.", "coupon_validate", 404);
        }

        if (!coupon.is_active) {
            return responseHelper.errorResponse(res, "coupon_inactive", "Este cupón ya no está disponible.", "coupon_validate", 400);
        }

        const today = new Date().toISOString().split('T')[0];
        if (coupon.expiration_date < today) {
            return responseHelper.errorResponse(res, "coupon_expired", "Este cupón ya venció.", "coupon_validate", 400);
        }

        if (coupon.max_uses !== null && coupon.current_uses >= coupon.max_uses) {
            return responseHelper.errorResponse(res, "coupon_limit_reached", "Este cupón alcanzó su límite de usos.", "coupon_validate", 400);
        }

        if (coupon.type === 'personalized') {
          const assigned = await UserCoupons.findOne({
              where: { id_user, id_coupon: coupon.id_coupon }
          });
          if (!assigned) {
              return responseHelper.errorResponse(res, "coupon_not_assigned", "Este cupón no está disponible para tu cuenta.", "coupon_validate", 403);
          }
          if (assigned.used) {
              return responseHelper.errorResponse(res, "coupon_already_used", "Ya usaste este cupón.", "coupon_validate", 400);
          }
      }

        return responseHelper.successResponse(res, {
            id_coupon: coupon.id_coupon,
            code: coupon.code,
            discount: coupon.discount,
            discount_type: coupon.discount_type
        }, "coupon_validate");

    } catch (error) {
        console.error("Error al validar el cupón:", error);
        return responseHelper.errorResponse(res, "server_error", error.message, "coupon_validate", 500);
    }
};

module.exports = validateCoupon;