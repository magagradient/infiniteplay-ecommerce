module.exports = (models) => {
  models.StudioCategories.hasMany(models.StudioResources, {
      foreignKey: "id_studio_category",
      as: "resources",
  });

  models.StudioResources.belongsTo(models.StudioCategories, {
      foreignKey: "id_studio_category",
      as: "category",
  });

  models.StudioDrafts.belongsTo(models.Users, { foreignKey: "id_user" });
  models.Users.hasMany(models.StudioDrafts, { foreignKey: "id_user" });

  models.StudioDrafts.belongsTo(models.Products, { foreignKey: "id_product" });
};