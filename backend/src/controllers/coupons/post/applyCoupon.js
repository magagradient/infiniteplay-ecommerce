const { UserCoupons, Coupons, Users, sequelize } = require("../../../database/indexModels");
const responseHelper = require('../../../utils/responseHelper');

const applyCoupon = async (req, res) => {
  const { id_user, id_coupon } = req.params;

  const t = await sequelize.transaction();

  try {
    const user = await Users.findByPk(id_user, { transaction: t });
    // lock: bloquea la fila del cupón hasta que termine la transacción,
    // así dos compras simultáneas no pisan el mismo current_uses
    const coupon = await Coupons.findByPk(id_coupon, { transaction: t, lock: t.LOCK.UPDATE });

    if (!user || !coupon) {
      await t.rollback();
      return responseHelper.errorResponse(res, "user_or_coupon_not_found", "Usuario o cupón no encontrado.", "apply_coupon", 404);
    }

    if (!coupon.is_active) {
      await t.rollback();
      return responseHelper.errorResponse(res, "coupon_inactive", "Este cupón ya no está disponible.", "apply_coupon", 400);
    }

    const today = new Date().toISOString().split('T')[0];
    if (coupon.expiration_date < today) {
      await t.rollback();
      return responseHelper.errorResponse(res, "coupon_expired", "Este cupón ya venció.", "apply_coupon", 400);
    }

    if (coupon.max_uses !== null && coupon.current_uses >= coupon.max_uses) {
      await t.rollback();
      return responseHelper.errorResponse(res, "coupon_limit_reached", "Este cupón alcanzó su límite de usos.", "apply_coupon", 400);
    }

    const existingCoupon = await UserCoupons.findOne({
      where: { id_user, id_coupon },
      transaction: t
    });

    if (existingCoupon && existingCoupon.used) {
      await t.rollback();
      return responseHelper.errorResponse(res, "coupon_already_used", "El cupón ya ha sido utilizado por este usuario.", "apply_coupon", 400);
    }

    const newUserCoupon = existingCoupon
      ? await existingCoupon.update({ used: 1 }, { transaction: t })
      : await UserCoupons.create({ id_user, id_coupon, used: 1 }, { transaction: t });

    coupon.current_uses += 1;
    await coupon.save({ transaction: t });

    await t.commit();

    return responseHelper.successResponse(res, {
      userCoupon: newUserCoupon,
      user,
      coupon
    }, "apply_coupon");

  } catch (error) {
    await t.rollback();
    console.error("Error al aplicar el cupón al usuario:", error);
    return responseHelper.errorResponse(res, "server_error", error.message, "apply_coupon", 500);
  }
};

module.exports = applyCoupon;