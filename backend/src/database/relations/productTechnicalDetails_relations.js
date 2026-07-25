module.exports = (models) => {
  const { Products, ProductTechnicalDetails } = models;

  Products.hasMany(ProductTechnicalDetails, {
    foreignKey: "id_product",
    as: "technicalDetails",
  });

  ProductTechnicalDetails.belongsTo(Products, {
    foreignKey: "id_product",
    as: "product",
  });
};