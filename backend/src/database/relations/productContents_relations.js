module.exports = (models) => {
  const {
    Products,
    Categories,
    ProductContents,
  } = models;

  Products.hasMany(ProductContents, {
    foreignKey: "id_product",
    as: "contents",
  });

  ProductContents.belongsTo(Products, {
    foreignKey: "id_product",
    as: "product",
  });

  Categories.hasMany(ProductContents, {
    foreignKey: "id_category",
    as: "productContents",
  });

  ProductContents.belongsTo(Categories, {
    foreignKey: "id_category",
    as: "category",
  });
};