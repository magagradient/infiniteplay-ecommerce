// routes/studioRouter.js
const express = require("express");

const listCategories = require("../controllers/studio/categories/index");
const createCategory = require("../controllers/studio/categories/create");
const destroyCategory = require("../controllers/studio/categories/destroy");

const listResources = require("../controllers/studio/resources/index");
const createResource = require("../controllers/studio/resources/create");
const destroyResource = require("../controllers/studio/resources/destroy");

const authMiddleware = require("../middlewares/authMiddleware");
const studioAccess = require("../middlewares/studioAccess");
const uploadStudioResource = require("../middlewares/uploadStudioResource");

const router = express.Router();

/* ---------- Categories ---------- */
router.get("/categories", authMiddleware(), listCategories); // ⬅ cambio: ahora requiere login
router.post("/categories", authMiddleware(["admin"]), createCategory);
router.delete("/categories/:id", authMiddleware(["admin"]), destroyCategory);

/* ---------- Resources ---------- */
router.get("/resources", authMiddleware(), studioAccess, listResources);
router.post("/resources", authMiddleware(["admin"]), uploadStudioResource.single("image"), createResource);
router.delete("/resources/:id", authMiddleware(["admin"]), destroyResource);

module.exports = router;