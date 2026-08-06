const { SeriesDiscountRules } = require("../../../database/indexModels");
const responseHelper = require("../../../utils/responseHelper");

const createSeriesDiscountRule = async (req, res) => {
  const { min_pieces, discount_percentage } = req.body;

  try {
    const existing = await SeriesDiscountRules.findOne({ where: { min_pieces } });
    if (existing) {
      return responseHelper.errorResponse(
        res,
        "rule_already_exists",
        "Ya existe una regla para esa cantidad de piezas.",
        "series_discount_rule_create",
        409
      );
    }

    const created = await SeriesDiscountRules.create({
      min_pieces,
      discount_percentage,
    });

    return responseHelper.successResponse(res, created, "series_discount_rule_create");
  } catch (error) {
    console.error(error);
    return responseHelper.errorResponse(
      res,
      "server_error",
      error.message,
      "series_discount_rule_create",
      500
    );
  }
};

module.exports = createSeriesDiscountRule;