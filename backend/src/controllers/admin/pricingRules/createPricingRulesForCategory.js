const createDefaultPricingRules = require("../../../services/pricingRules/createDefaultPricingRules");
const { PricingRules } = require("../../../database/indexModels");
const responseHelper = require("../../../utils/responseHelper");

const createPricingRulesForCategory = async (req, res) => {
  const { id_category } = req.params;

  try {
    const existing = await PricingRules.findOne({ where: { id_category } });

    if (existing) {
      return responseHelper.errorResponse(
        res,
        "pricing_rules_already_exist",
        "Esta categoría ya tiene reglas de precio cargadas.",
        "pricing_rules_create",
        409
      );
    }

    await createDefaultPricingRules(id_category);

    const created = await PricingRules.findAll({ where: { id_category } });

    return responseHelper.successResponse(
      res,
      created,
      "pricing_rules_create"
    );
  } catch (error) {
    console.error(error);

    return responseHelper.errorResponse(
      res,
      "server_error",
      error.message,
      "pricing_rules_create",
      500
    );
  }
};

module.exports = createPricingRulesForCategory;