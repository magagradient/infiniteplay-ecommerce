const express = require('express');
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const validateSchema = require("../middlewares/validateSchema");

const idParamSchema = require("../validators/shared/idParamSchema");
const userIdParamSchema = require("../validators/shared/userIdParamSchema");
const createCouponSchema = require("../validators/coupons/createCouponSchema");
const updateCouponSchema = require("../validators/coupons/updateCouponSchema");
const userCouponParamsSchema = require("../validators/coupons/userCouponParamsSchema");
const validateCouponSchema = require("../validators/coupons/validateCouponSchema");

// Controllers
const index = require("../controllers/coupons/get/index");
const userCoupons = require("../controllers/coupons/get/userCoupons");
const show = require("../controllers/coupons/get/show");

const create = require("../controllers/coupons/post/create");
const applyCoupon = require("../controllers/coupons/post/applyCoupon");
const validateCoupon = require("../controllers/coupons/post/validateCoupon");

const update = require("../controllers/coupons/put/update");

const destroy = require("../controllers/coupons/delete/destroy"); // corregido typo

/* --------------------------------------- */

// GET
router.get("/", index);

router.get("/users/:id_user/coupons",
    authMiddleware,
    validateSchema(userIdParamSchema, "params"),
    userCoupons
);

router.get("/:id",
    authMiddleware,
    validateSchema(idParamSchema, "params"),
    show
);

// POST
router.post("/",
    authMiddleware,
    validateSchema(createCouponSchema, "body"),
    create
);

router.post("/validate",
    authMiddleware,
    validateSchema(validateCouponSchema, "body"),
    validateCoupon
);

router.post("/users/:id_user/coupons/:id_coupon",
    authMiddleware,
    validateSchema(userCouponParamsSchema, "params"),
    applyCoupon
);

// PUT
router.put("/:id",
    authMiddleware,
    validateSchema(idParamSchema, "params"),
    validateSchema(updateCouponSchema, "body"),
    update
);

// DELETE
router.delete("/:id",
    authMiddleware,
    validateSchema(idParamSchema, "params"),
    destroy
);

module.exports = router;
