const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerConfig");
const auth = require("../middlewares/authMiddleware");
const loginLimiter = require("../middlewares/loginLimiter");
const registerLimiter = require("../middlewares/registerLimiter");
const validateSchema = require("../middlewares/validateSchema");

const updateUserSchema = require('../validators/users/updateUserSchema');
const registerSchema = require('../validators/users/registerSchema');
const loginSchema = require('../validators/users/loginSchema');
const idParamSchema = require('../validators/shared/idParamSchema');
const usersPaginationSchema = require('../validators/users/usersPaginationSchema');

// controllers
const index = require("../controllers/users/get/index");
const status = require("../controllers/users/get/status");
const show = require("../controllers/users/get/show");
const passwordChangesIndex = require("../controllers/passwordChanges/get/index");
const getProfile = require("../controllers/users/get/profile");
const studioAccess = require("../controllers/users/get/studioAccess");

// post
const create = require("../controllers/users/post/create");
const login = require("../controllers/users/post/login");
const refresh = require("../controllers/users/post/refresh");
const logout = require("../controllers/users/post/logout");

// put
const update = require("../controllers/users/put/update");

// patch
const updateAvatar = require("../controllers/users/patch/updateAvatar");
const updateRole = require("../controllers/users/patch/updateRole");

// delete
const destroy = require("../controllers/users/delete/destroy");

// get (protegidas)
router.get("/", auth(), validateSchema(usersPaginationSchema, "query"), index);
router.get("/status", auth(), status);
router.get("/profile", auth(), getProfile);
router.get("/studio-access", auth(), studioAccess);
router.get("/:id", auth(), validateSchema(idParamSchema, "params"), show);
router.get("/:id/password-changes", auth(), validateSchema(idParamSchema, "params"), passwordChangesIndex);


// post (públicas)
router.post("/login", loginLimiter, validateSchema(loginSchema, "body"), login);
router.post("/", registerLimiter, validateSchema(registerSchema, "body"), create);
router.post("/refresh", refresh);
router.post("/logout", logout);


// put (protegida)
router.put("/:id", auth(), validateSchema(idParamSchema, "params"), validateSchema(updateUserSchema, "body"), update);

// patch (protegidas)
router.patch("/:id/avatar", auth(), validateSchema(idParamSchema, "params"), upload.single("avatar"), updateAvatar);

//  solo admin
router.patch("/:id/role", auth(["admin"]), validateSchema(idParamSchema, "params"), updateRole);

//  solo admin
router.delete("/:id", auth(["admin"]), validateSchema(idParamSchema, "params"), destroy);

module.exports = router;