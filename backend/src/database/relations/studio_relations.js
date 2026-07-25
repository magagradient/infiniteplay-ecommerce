module.exports = (models) => {
  models.StudioCategories.hasMany(models.StudioResources, {
      foreignKey: "id_studio_category",
      as: "resources",
  });

  models.StudioResources.belongsTo(models.StudioCategories, {
      foreignKey: "id_studio_category",
      as: "category",
  });
};