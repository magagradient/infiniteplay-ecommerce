const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const getProducts = require("../controllers/admin/products/getProducts");
const updateProduct = require("../controllers/admin/products/updateProduct");
const deleteProduct = require("../controllers/admin/products/deleteProduct");
const permanentDeleteProduct = require("../controllers/admin/products/permanentDeleteProduct");
const getOrders = require("../controllers/admin/orders/getOrders");
const getUsers = require("../controllers/admin/users/getUsers");
const getPricingRules = require("../controllers/admin/pricingRules/getPricingRules");
const updatePricingRule = require("../controllers/admin/pricingRules/updatePricingRule");
const getPendingCustomizations = require("../controllers/admin/customizations/getPendingCustomizations");
const completeCustomization = require("../controllers/admin/customizations/completeCustomization");
const createTechnicalDetail = require("../controllers/admin/technicalDetails/createTechnicalDetail");
const updateTechnicalDetail = require("../controllers/admin/technicalDetails/updateTechnicalDetail");
const deleteTechnicalDetail = require("../controllers/admin/technicalDetails/deleteTechnicalDetail");
const createIncludedResource = require("../controllers/admin/includedResources/createIncludedResource");
const updateIncludedResource = require("../controllers/admin/includedResources/updateIncludedResource");
const deleteIncludedResource = require("../controllers/admin/includedResources/deleteIncludedResource");
const createPricingRulesForCategory = require("../controllers/admin/pricingRules/createPricingRulesForCategory");
const createProductContent = require("../controllers/admin/productContents/createProductContent");
const getProductContents = require("../controllers/admin/productContents/getProductContents");
const updateProductContent = require("../controllers/admin/productContents/updateProductContent");
const deleteProductContent = require("../controllers/admin/productContents/deleteProductContent");


// Rutas
router.get("/products", authMiddleware(["admin"]), getProducts);
router.put("/products/:id", authMiddleware(["admin"]), updateProduct);
router.delete("/products/:id", authMiddleware(["admin"]), deleteProduct);
router.delete("/products/:id/permanent", authMiddleware(["admin"]), permanentDeleteProduct);
router.get("/orders", authMiddleware(["admin"]), getOrders);
router.get("/users", authMiddleware(["admin"]), getUsers);
router.get("/pricing-rules", authMiddleware(["admin"]), getPricingRules);
router.put("/pricing-rules/:id", authMiddleware(["admin"]), updatePricingRule);
router.get("/customizations/pending", authMiddleware(["admin"]), getPendingCustomizations);
router.patch("/customizations/:id_order/:id_product/complete", authMiddleware(["admin"]), completeCustomization);
router.post("/products/:id/technical-details", authMiddleware(["admin"]), createTechnicalDetail);
router.post("/pricing-rules/category/:id_category", authMiddleware(["admin"]), createPricingRulesForCategory);
router.put("/technical-details/:id_detail", authMiddleware(["admin"]), updateTechnicalDetail);
router.delete("/technical-details/:id_detail", authMiddleware(["admin"]), deleteTechnicalDetail);
router.post("/products/:id/included-resources", authMiddleware(["admin"]), createIncludedResource);
router.put("/included-resources/:id_resource", authMiddleware(["admin"]), updateIncludedResource);
router.delete("/included-resources/:id_resource", authMiddleware(["admin"]), deleteIncludedResource);
router.post("/products/:id/contents",authMiddleware(["admin"]),createProductContent);
router.get("/products/:id/contents",authMiddleware(["admin"]),getProductContents);
router.put("/product-contents/:id_product_content",authMiddleware(["admin"]),updateProductContent);
router.delete("/product-contents/:id_product_content",authMiddleware(["admin"]),deleteProductContent);

module.exports = router;