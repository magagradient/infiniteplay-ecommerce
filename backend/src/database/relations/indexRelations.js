const ecommerceRelations = require("./ecommerce_relations");
const usersRelations = require("./users_relations");
const ordersRelations = require("./orders_relations");
const couponsRelations = require("./coupons_relations");
const blogRelations = require("./blog_relations");
const favoriteSeriesRelations = require("./favoriteSeries_relations");
const favoriteProductsRelations = require("./favoriteProducts_relations");
const keywordsRelations = require("./keywords_relations");
const shoppingRelations = require("./shopping_relations");
const studioRelations = require("./studio_relations");
const productTechnicalDetailsRelations = require("./productTechnicalDetails_relations");
const productIncludedResourcesRelations = require("./productIncludedResources_relations");

module.exports = (models) => {
    ecommerceRelations(models);
    usersRelations(models);
    ordersRelations(models);
    couponsRelations(models);
    blogRelations(models);
    favoriteSeriesRelations(models);
    favoriteProductsRelations(models);
    keywordsRelations(models);
    shoppingRelations(models);
    studioRelations(models);
    productTechnicalDetailsRelations(models);
    productIncludedResourcesRelations(models);
};
