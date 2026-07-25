const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const getProducts = require("../controllers/admin/products/getProducts");
const updateProduct = require("../controllers/admin/products/updateProduct");
const deleteProduct = require("../controllers/admin/products/deleteProduct");
const permanentDeleteProduct = require("../controllers/admin/products/permanentDeleteProduct");
const getOrders = require("../controllers/admin/orders/getOrders");
const getUsers = require("../controllers/admin/users/getUsers");
const getPendingCustomizations = require("../controllers/admin/customizations/getPendingCustomizations");
const completeCustomization = require("../controllers/admin/customizations/completeCustomization");
const createTechnicalDetail = require("../controllers/admin/technicalDetails/createTechnicalDetail");
const updateTechnicalDetail = require("../controllers/admin/technicalDetails/updateTechnicalDetail");
const deleteTechnicalDetail = require("../controllers/admin/technicalDetails/deleteTechnicalDetail");
const createIncludedResource = require("../controllers/admin/includedResources/createIncludedResource");
const updateIncludedResource = require("../controllers/admin/includedResources/updateIncludedResource");
const deleteIncludedResource = require("../controllers/admin/includedResources/deleteIncludedResource");

// todas las rutas de admin requieren rol 'admin'
router.get("/products", authMiddleware(["admin"]), getProducts);
router.put("/products/:id", authMiddleware(["admin"]), updateProduct);
router.delete("/products/:id", authMiddleware(["admin"]), deleteProduct);
router.delete("/products/:id/permanent", authMiddleware(["admin"]), permanentDeleteProduct);
router.get("/orders", authMiddleware(["admin"]), getOrders);
router.get("/users", authMiddleware(["admin"]), getUsers);
router.get("/customizations/pending", authMiddleware(["admin"]), getPendingCustomizations);
router.patch("/customizations/:id_order/:id_product/complete", authMiddleware(["admin"]), completeCustomization);
router.post("/products/:id/technical-details", authMiddleware(["admin"]), createTechnicalDetail);
router.put("/technical-details/:id_detail", authMiddleware(["admin"]), updateTechnicalDetail);
router.delete("/technical-details/:id_detail", authMiddleware(["admin"]), deleteTechnicalDetail);
router.post("/products/:id/included-resources", authMiddleware(["admin"]), createIncludedResource);
router.put("/included-resources/:id_resource", authMiddleware(["admin"]), updateIncludedResource);
router.delete("/included-resources/:id_resource", authMiddleware(["admin"]), deleteIncludedResource);

module.exports = router;