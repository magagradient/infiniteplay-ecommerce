const sequelize = require("../connection/connection");
const { DataTypes } = require("sequelize");
const relations = require("../database/relations/indexRelations");

// modelos:

// Blog:
const AuthorsModel = require("../models/authors");
const BlogPostsModel = require("../models/blog_posts");

// Productos:
const ProductsModel = require("../models/products");
const CategoriesModel = require("../models/categories");
const ProductColorsModel = require("../models/product_colors");
const ProductImagesModel = require("../models/product_images");
const ProductKeywordsModel = require("../models/product_keywords");
const ProductStylesModel = require("../models/product_styles");
const ProductThemesModel = require("../models/product_themes");
const ProductTechnicalDetailsModel = require("../models/product_technical_details");
const PricingRulesModel = require("../models/pricing_rules");
const ProductContentsModel = require("../models/product_contents");



// Atributos :
const ColorsModel = require("../models/colors");
const StylesModel = require("../models/styles");
const KeywordsModel = require("../models/keywords");
const SeriesModel = require("../models/series");
const ThemesModel = require("../models/themes");

// Usuarios:
const UsersModel = require("../models/users");
const PasswordChangesModel = require("../models/password_changes");
const PasswordResetsModel = require("../models/password_resets");
const FavoriteSeriesModel = require("../models/favorite_series");
const FavoriteProductsModel = require("../models/favorite_products");
const UserCouponsModel = require("../models/user_coupons");
const RefreshTokensModel = require("../models/refresh_tokens");

// Carritos y Órdenes:
const ShoppingCartsModel = require("../models/shopping_carts");
const CartItemsModel = require("../models/cart_items");
const OrdersModel = require("../models/orders");
const OrdersProductsModel = require("../models/orders_products");

// Pagos: 
const PaymentMethodsModel = require("../models/payment_methods");
const PaymentsModel = require("../models/payments");
const InvoicesModel = require("../models/invoices");

// Cupones y descargas: 
const CouponsModel = require("../models/coupons");
const DownloadLinksModel = require("../models/download_links");
const SeriesDiscountRulesModel = require("../models/series_discount_rules");

// Studio
const StudioCategoriesModel = require("../models/studio_categories");
const StudioResourcesModel = require("../models/studio_resources");
const StudioFontsModel = require("../models/studio_fonts");
const StudioDraftsModel = require("../models/studio_drafts");


// instanciar modelos:

const models = {
  Authors: AuthorsModel(sequelize, DataTypes),
  BlogPosts: BlogPostsModel(sequelize, DataTypes),
  CartItems: CartItemsModel(sequelize, DataTypes),
  Categories: CategoriesModel(sequelize, DataTypes),
  Colors: ColorsModel(sequelize, DataTypes),
  Coupons: CouponsModel(sequelize, DataTypes),
  DownloadLinks: DownloadLinksModel(sequelize, DataTypes),
  SeriesDiscountRules: SeriesDiscountRulesModel(sequelize, DataTypes),
  FavoriteSeries: FavoriteSeriesModel(sequelize, DataTypes),
  FavoriteProducts: FavoriteProductsModel(sequelize, DataTypes),
  Invoices: InvoicesModel(sequelize, DataTypes),
  Keywords: KeywordsModel(sequelize, DataTypes),
  Orders: OrdersModel(sequelize, DataTypes),
  OrdersProducts: OrdersProductsModel(sequelize, DataTypes),
  PasswordChanges: PasswordChangesModel(sequelize, DataTypes),
  PasswordResets: PasswordResetsModel(sequelize, DataTypes),
  PaymentMethods: PaymentMethodsModel(sequelize, DataTypes),
  Payments: PaymentsModel(sequelize, DataTypes),
  ProductColors: ProductColorsModel(sequelize, DataTypes),
  ProductImages: ProductImagesModel(sequelize, DataTypes),
  ProductKeywords: ProductKeywordsModel(sequelize, DataTypes),
  ProductStyles: ProductStylesModel(sequelize, DataTypes),
  ProductThemes: ProductThemesModel(sequelize, DataTypes),
  ProductTechnicalDetails: ProductTechnicalDetailsModel(sequelize, DataTypes),
  ProductContents: ProductContentsModel(sequelize, DataTypes),
  Products: ProductsModel(sequelize, DataTypes),
  PricingRules: PricingRulesModel(sequelize, DataTypes),
  Series: SeriesModel(sequelize, DataTypes),
  ShoppingCarts: ShoppingCartsModel(sequelize, DataTypes),
  Styles: StylesModel(sequelize, DataTypes),
  Themes: ThemesModel(sequelize, DataTypes),
  UserCoupons: UserCouponsModel(sequelize, DataTypes),
  Users: UsersModel(sequelize, DataTypes),
  RefreshTokens: RefreshTokensModel(sequelize, DataTypes),
  StudioCategories: StudioCategoriesModel(sequelize, DataTypes),
  StudioResources: StudioResourcesModel(sequelize, DataTypes),
  StudioFonts: StudioFontsModel(sequelize, DataTypes),
  StudioDrafts: StudioDraftsModel(sequelize, DataTypes)
};

// relaciones: 

relations(models)

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log("✅ Base de datos conectada con éxito");
    } catch (error) {
        console.error("❌ Error al conectar a la base de datos:", error.message);
        process.exit(1);
    }
};



module.exports = { sequelize, connectDB, ...models };


