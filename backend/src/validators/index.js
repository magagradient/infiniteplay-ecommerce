// shared
const idParamSchema = require('./shared/idParamSchema');
const userIdParamSchema = require('./shared/userIdParamSchema');

// products
const {
  productCreateSchema,
  productUpdateSchema,
  productFilterSchema,
  productSearchSchema,
  deleteRelationSchema,
  productRelationSchemas,
  statusParamSchema,
  updateRelationsSchema,
  productsArraySchema,
  assignRelationParamsSchema,
  assignRelationSchema,
} = require('./products');


// categories
const {
  categoryCreateSchema,
  categoryUpdateSchema
} = require('./categories');

// colors
const {
  colorCreateSchema,
  colorUpdateSchema
} = require('./colors');

// styles
const {
  createStyleSchema,
  updateStyleSchema
} = require('./styles');

// themes
const {
  createThemeSchema,
  updateThemeSchema
} = require("./themes");

// keywords
const {
  createKeywordSchema,
  updateKeywordSchema
} = require('./keywords');

// series
const {
  createSeriesSchema,
  updateSeriesSchema
} = require("./series");

// authors
const {
  createAuthorSchema,
  updateAuthorSchema
} = require('./authors');

// blogPosts
const {
  createBlogPostSchema,
  updateBlogPostSchema
} = require('./blogPost');

// productColors
const {
  productColorParamsSchema
} = require('./productColor');

// productImages
const {
  createProductImageSchema,
  productImageParamsSchema
} = require('./productImages');

// productKeywords
const {
  createProductKeywordSchema,
  paramsProductKeywordSchema,
  idProductParamSchema
} = require('./productKeywords');

// cartItems
const {
  createCartItemSchema,
  updateCartItemSchema,
  cartItemsQuerySchema
} = require('./cartItems');

// coupons
const {
  createCouponSchema,
  updateCouponSchema,
  userCouponParamsSchema,
} = require('./coupons');

// downloadLinks
const {
  createDownloadLinkSchema,
  updateDownloadLinkSchema,
  productIdParamSchema,
} = require('./downloadLinks')


// favoriteSeries
const {
  favoriteSeriesCreateSchema,
  favoriteSeriesParamsSchema,
} = require('./favoriteSeries')

// favoriteProducts
const {
  favoriteProductCreateSchema,
  favoriteProductParamsSchema,
} = require('./favoriteProducts');

// invoices
const {
  invoiceCreateSchema,
  invoiceUpdateSchema,
  invoicesQuerySchema
} = require('./invoices')

// orders
const {
  orderCreateSchema,
  orderUpdateSchema,
  ordersPaginationSchema
} = require('./orders')

// ordersProducts
const {
  ordersProductsParamsSchema,
  ordersProductsCreateSchema,
  ordersProductsUpdateSchema,
  ordersProductsOnlyOrderParamSchema
} = require('./ordersProducts')

// payments
const {
  paymentCreateSchema,
  paymentUpdateSchema,
} = require("./payments");

// paymentsMethods
const {
  paymentMethodCreateSchema,
  paymentMethodUpdateSchema
} = require("./paymentMethods");

// productStyles
const {
  productStyleParamsSchema,
  productStyleIdParamSchema,
  productStyleCreateSchema
} = require("./productStyle");

const {
  createShoppingCartSchema
} = require('./shoppingCarts');

// userCoupons
const {
  createUserCouponSchema,
  updateUserCouponSchema,
} = require('./userCoupons');

// auth
const {
  loginSchema,
  registerSchema,
  updateUserSchema,
  usersPaginationSchema
} = require('./users');

// passwordChanges
const createPasswordChangeSchema = require('./passwordChanges');

// passwordReset
const {
  confirmPasswordResetSchema,
  requestPasswordResetSchema,
  tokenParamSchema,
} = require('./passwordResets')


// export general
module.exports = {
  // products
  productCreateSchema,
  productUpdateSchema,
  productFilterSchema,
  productSearchSchema,
  deleteRelationSchema,
  productRelationSchemas,
  statusParamSchema,
  updateRelationsSchema,
  productsArraySchema,
  assignRelationParamsSchema,
  assignRelationSchema,

  // favoriteProducts
  favoriteProductCreateSchema,
  favoriteProductParamsSchema,

  // categories
  categoryCreateSchema,
  categoryUpdateSchema,

  // colors
  colorCreateSchema,
  colorUpdateSchema,

  // styles
  createStyleSchema,
  updateStyleSchema,

  // themes
  createThemeSchema,
  updateThemeSchema,

  // keywords
  createKeywordSchema,
  updateKeywordSchema,

  // series
  createSeriesSchema,
  updateSeriesSchema,

  // authors
  createAuthorSchema,
  updateAuthorSchema,

  // shared
  idParamSchema,
  userIdParamSchema,

  // blogPost
  createBlogPostSchema,
  updateBlogPostSchema,

  // productColor
  productColorParamsSchema,

  // productimages
  createProductImageSchema,
  productImageParamsSchema,

  // productKeywords
  createProductKeywordSchema,
  paramsProductKeywordSchema,
  idProductParamSchema,

  // cartItems
  createCartItemSchema,
  updateCartItemSchema,
  cartItemsQuerySchema,

  // coupons
  createCouponSchema,
  updateCouponSchema,
  userCouponParamsSchema,

  // downloadLinks
  createDownloadLinkSchema,
  updateDownloadLinkSchema,
  productIdParamSchema,

  // invoices
  invoiceCreateSchema,
  invoiceUpdateSchema,
  invoicesQuerySchema,

  // orders
  orderCreateSchema,
  orderUpdateSchema,
  ordersPaginationSchema,

  // ordersProducts
  ordersProductsParamsSchema,
  ordersProductsCreateSchema,
  ordersProductsUpdateSchema,
  ordersProductsOnlyOrderParamSchema,

  // payments
  paymentCreateSchema,
  paymentUpdateSchema,

  // paymentMethods
  paymentMethodCreateSchema,
  paymentMethodUpdateSchema,

  // productStyles
  productStyleParamsSchema,
  productStyleIdParamSchema,
  productStyleCreateSchema,

  // shoppingCarts
  createShoppingCartSchema,

  // userCoupons
  createUserCouponSchema,
  updateUserCouponSchema,

  // users
  loginSchema,
  registerSchema,
  updateUserSchema,
  usersPaginationSchema,

  // PasswordChanges
  createPasswordChangeSchema,

  // passwordReset
  confirmPasswordResetSchema,
  requestPasswordResetSchema,
  tokenParamSchema,
};


