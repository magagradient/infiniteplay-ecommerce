const { PricingRules, Categories } = require("../../../database/indexModels");
const responseHelper = require("../../../utils/responseHelper");

const getPricingRules = async (req, res) => {
  try {
    const pricingRules = await PricingRules.findAll({
      include: [
        {
          model: Categories,
          as: "category",
          attributes: ["id_category", "name"],
        },
      ],
      order: [
        [{ model: Categories, as: "category" }, "name", "ASC"],
        ["artwork_level", "ASC"],
      ],
    });

    return responseHelper.successResponse(
      res,
      pricingRules,
      "pricing_rules_get"
    );
  } catch (error) {
    console.error(error);

    return responseHelper.errorResponse(
      res,
      "server_error",
      error.message,
      "pricing_rules_get",
      500
    );
  }
};

module.exports = getPricingRules;