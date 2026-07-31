const { PricingRules } = require("../../../database/indexModels");
const responseHelper = require("../../../utils/responseHelper");

const updatePricingRule = async (req, res) => {
  console.log("PARAMS:", req.params);
  console.log("BODY:", req.body);

  const { id } = req.params;
  const { suggested_price, is_active } = req.body;

  try {
    const pricingRule = await PricingRules.findByPk(id);

    if (!pricingRule) {
      return responseHelper.errorResponse(
        res,
        "pricing_rule_not_found",
        "Regla de precio no encontrada.",
        "pricing_rules_update",
        404
      );
    }

    await pricingRule.update({
      suggested_price,
      is_active,
    });

    return responseHelper.successResponse(
      res,
      pricingRule,
      "pricing_rules_update"
    );

  } catch (error) {
    console.error(error);

    return responseHelper.errorResponse(
      res,
      "server_error",
      error.message,
      "pricing_rules_update",
      500
    );
  }
};

module.exports = updatePricingRule;