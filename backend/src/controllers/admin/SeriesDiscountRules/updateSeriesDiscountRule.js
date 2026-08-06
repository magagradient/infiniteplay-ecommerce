const { SeriesDiscountRules } = require("../../../database/indexModels");
const responseHelper = require("../../../utils/responseHelper");

const updateSeriesDiscountRule = async (req, res) => {
  const { id_discount_rule } = req.params;
  const { min_pieces, discount_percentage, is_active } = req.body;

  try {
    const rule = await SeriesDiscountRules.findByPk(id_discount_rule);

    if (!rule) {
      return responseHelper.errorResponse(
        res,
        "rule_not_found",
        "No se encontró la regla de descuento.",
        "series_discount_rule_update",
        404
      );
    }

    await rule.update({
      ...(min_pieces !== undefined && { min_pieces }),
      ...(discount_percentage !== undefined && { discount_percentage }),
      ...(is_active !== undefined && { is_active }),
    });

    return responseHelper.successResponse(res, rule, "series_discount_rule_update");
  } catch (error) {
    console.error(error);
    return responseHelper.errorResponse(
      res,
      "server_error",
      error.message,
      "series_discount_rule_update",
      500
    );
  }
};

module.exports = updateSeriesDiscountRule;