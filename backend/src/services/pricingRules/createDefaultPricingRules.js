const { PricingRules } = require("../../database/indexModels");

const createDefaultPricingRules = async (id_category) => {
  const levels = ["core", "signature", "premium"];

  const rules = levels.map((level) => ({
    id_category,
    artwork_level: level,
    suggested_price: 0,
    is_active: true,
  }));

  await PricingRules.bulkCreate(rules);
};

module.exports = createDefaultPricingRules;