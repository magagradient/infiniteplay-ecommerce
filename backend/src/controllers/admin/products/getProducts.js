const {
  Products,
  Categories,
  Series,
  ProductImages,
  Keywords,
  Colors,
} = require("../../../database/indexModels");

const { successResponse, errorResponse } = require("../../../utils/responseHelper");

const getProducts = async (req, res) => {
  try {
    const products = await Products.findAll({
      include: [
        {
          model: Categories,
          as: "category",
        },
        {
          model: Series,
          as: "series",
        },
        {
          model: ProductImages,
          as: "images",
          required: false,
          separate: true,
          limit: 1,
          order: [["image_type", "DESC"]],
        },
        {
          model: Keywords,
          as: "keywords",
          through: { attributes: [] },
        },
        {
          model: Colors,
          as: "colors",
          through: { attributes: [] },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const productsData = products.map((p) => p.get({ plain: true }));

    if (productsData.length === 0) {
      return errorResponse(res, "not_found", "No hay productos.", "admin_getProducts", 404);
    }

    return successResponse(res, productsData, "admin_getProducts");
  } catch (error) {
    console.error("🔴 Error admin getProducts:", error);
    return errorResponse(res, "server_error", "Error interno del servidor.", "admin_getProducts", 500);
  }
};

module.exports = getProducts;