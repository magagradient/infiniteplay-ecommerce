module.exports = (models) => {

  models.Categories.hasMany(models.PricingRules, {
      foreignKey: "id_category",
      as: "pricingRules",
  });

  models.PricingRules.belongsTo(models.Categories, {
      foreignKey: "id_category",
      as: "category",
  });

};