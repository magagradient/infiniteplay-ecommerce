module.exports = (models) => {
  const { Products, Categories, ProductIncludedResources } = models;

  Products.hasMany(ProductIncludedResources, {
    foreignKey: "id_product",
    as: "includedResources",
  });

  ProductIncludedResources.belongsTo(Products, {
    foreignKey: "id_product",
    as: "product",
  });

  ProductIncludedResources.belongsTo(Categories, {
    foreignKey: "id_category",
    as: "category",
  });

  Categories.hasMany(ProductIncludedResources, {
    foreignKey: "id_category",
    as: "usedAsIncludedResource",
  });
};