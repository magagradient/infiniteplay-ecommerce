// routes/studioRouter.js
const express = require("express");

const listCategories = require("../controllers/studio/categories/index");
const createCategory = require("../controllers/studio/categories/create");
const destroyCategory = require("../controllers/studio/categories/destroy");

const listResources = require("../controllers/studio/resources/index");
const createResource = require("../controllers/studio/resources/create");
const destroyResource = require("../controllers/studio/resources/destroy");

const listFonts = require("../controllers/studio/fonts/index");
const createFont = require("../controllers/studio/fonts/create");
const destroyFont = require("../controllers/studio/fonts/destroy");

const authMiddleware = require("../middlewares/authMiddleware");
const studioAccess = require("../middlewares/studioAccess");
const uploadStudioResource = require("../middlewares/uploadStudioResource");

const listDrafts = require("../controllers/studio/drafts/index");
const createDraft = require("../controllers/studio/drafts/create");
const uploadUserResource = require("../controllers/studio/drafts/uploadUserResource");
const destroyDraft = require("../controllers/studio/drafts/destroy");


const router = express.Router();

/* ---------- Categories ---------- */
router.get("/categories", listCategories); // ⬅ cambio: ahora requiere login
router.post("/categories", authMiddleware(["admin"]), createCategory);
router.delete("/categories/:id", authMiddleware(["admin"]), destroyCategory);

/* ---------- Resources ---------- */
router.get("/resources", listResources);
router.post("/resources", authMiddleware(["admin"]), uploadStudioResource.single("image"), createResource);
router.delete("/resources/:id", authMiddleware(["admin"]), destroyResource);

/* ---------- Fonts ---------- */
router.get("/fonts", listFonts);
router.post("/fonts", authMiddleware(["admin"]), createFont);
router.delete("/fonts/:id", authMiddleware(["admin"]), destroyFont);

/* ---------- Drafts ---------- */
router.get("/drafts", listDrafts);
router.post("/drafts", authMiddleware(), uploadStudioResource.single("image"), createDraft);
router.post("/user-resources", authMiddleware(), uploadStudioResource.single("image"), uploadUserResource);
router.delete("/drafts/:id", authMiddleware(), destroyDraft);

module.exports = router;