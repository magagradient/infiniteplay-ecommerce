const { SeriesDiscountRules } = require("../../../database/indexModels");
const responseHelper = require("../../../utils/responseHelper");

const getSeriesDiscountRules = async (req, res) => {
  try {
    const rules = await SeriesDiscountRules.findAll({
      order: [["min_pieces", "ASC"]],
    });

    return responseHelper.successResponse(
      res,
      rules,
      "series_discount_rules_get"
    );
  } catch (error) {
    console.error(error);
    return responseHelper.errorResponse(
      res,
      "server_error",
      error.message,
      "series_discount_rules_get",
      500
    );
  }
};

module.exports = getSeriesDiscountRules;