const { SeriesDiscountRules } = require("../../../database/indexModels");
const responseHelper = require("../../../utils/responseHelper");

const deleteSeriesDiscountRule = async (req, res) => {
  const { id_discount_rule } = req.params;

  try {
    const rule = await SeriesDiscountRules.findByPk(id_discount_rule);

    if (!rule) {
      return responseHelper.errorResponse(
        res,
        "rule_not_found",
        "No se encontró la regla de descuento.",
        "series_discount_rule_delete",
        404
      );
    }

    await rule.destroy();

    return responseHelper.successResponse(res, null, "series_discount_rule_delete");
  } catch (error) {
    console.error(error);
    return responseHelper.errorResponse(
      res,
      "server_error",
      error.message,
      "series_discount_rule_delete",
      500
    );
  }
};

module.exports = deleteSeriesDiscountRule;