const { Orders, Coupons, UserCoupons, sequelize } = require("../../../database/indexModels");
const responseHelper = require("../../../utils/responseHelper");

const create = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { id_user, subtotal, coupon_code, status } = req.body;

        let discount_total = 0;
        let coupon = null;

        if (coupon_code) {
            coupon = await Coupons.findOne({ where: { code: coupon_code }, transaction: t, lock: t.LOCK.UPDATE });

            if (!coupon || !coupon.is_active) {
                await t.rollback();
                return responseHelper.errorResponse(res, "coupon_invalid", "Cupón no válido.", "orders_create", 400);
            }

            const today = new Date().toISOString().split('T')[0];
            if (coupon.expiration_date < today) {
                await t.rollback();
                return responseHelper.errorResponse(res, "coupon_expired", "Este cupón ya venció.", "orders_create", 400);
            }

            if (coupon.max_uses !== null && coupon.current_uses >= coupon.max_uses) {
                await t.rollback();
                return responseHelper.errorResponse(res, "coupon_limit_reached", "Este cupón alcanzó su límite de usos.", "orders_create", 400);
            }

            let userCoupon = null;
            if (coupon.type === 'personalized') {
                userCoupon = await UserCoupons.findOne({ where: { id_user, id_coupon: coupon.id_coupon }, transaction: t });
                if (!userCoupon || userCoupon.used) {
                    await t.rollback();
                    return responseHelper.errorResponse(res, "coupon_not_available", "Este cupón no está disponible para tu cuenta.", "orders_create", 403);
                }
            }

            discount_total = coupon.discount_type === 'percentage'
                ? +(subtotal * (coupon.discount / 100)).toFixed(2)
                : Math.min(coupon.discount, subtotal);

            coupon.current_uses += 1;
            await coupon.save({ transaction: t });

            if (userCoupon) {
                await userCoupon.update({ used: 1 }, { transaction: t });
            }
        }

        const total = +(subtotal - discount_total).toFixed(2);

        const newOrder = await Orders.create({
            id_user,
            subtotal,
            discount_total,
            total,
            status: status || "pending",
        }, { transaction: t });

        await t.commit();

        return responseHelper.successResponse(res, newOrder, "orders_create", 201);
    } catch (error) {
        await t.rollback();
        console.error("Error creating order:", error);
        return responseHelper.errorResponse(res, "server_error", error.message, "orders_create", 500);
    }
};

module.exports = create;