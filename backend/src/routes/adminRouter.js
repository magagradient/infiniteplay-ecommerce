const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const getProducts = require("../controllers/admin/products/getProducts");
const updateProduct = require("../controllers/admin/products/updateProduct");
const deleteProduct = require("../controllers/admin/products/deleteProduct");
const permanentDeleteProduct = require("../controllers/admin/products/permanentDeleteProduct");
const getOrders = require("../controllers/admin/orders/getOrders");
const getUsers = require("../controllers/admin/users/getUsers");

// todas las rutas de admin requieren rol 'admin'
router.get("/products", authMiddleware(["admin"]), getProducts);
router.put("/products/:id", authMiddleware(["admin"]), updateProduct);
router.delete("/products/:id", authMiddleware(["admin"]), deleteProduct);
router.delete("/products/:id/permanent", authMiddleware(["admin"]), permanentDeleteProduct);
router.get("/orders", authMiddleware(["admin"]), getOrders);
router.get("/users", authMiddleware(["admin"]), getUsers);

module.exports = router;