const { Products, Colors, Keywords, Series } = require("../../../database/indexModels");
const { successResponse, errorResponse } = require("../../../utils/responseHelper");

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      description_long,
      price,
      is_sold,
      is_deleted,
      visible_in_portfolio,
      id_category,
      id_series,
      colors,
      keywords,
    } = req.body;

    const product = await Products.findByPk(id);

    if (!product) {
      return errorResponse(res, "not_found", "Producto no encontrado.", "admin_updateProduct", 404);
    }

    await product.update({
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(description_long !== undefined && { description_long }),
      ...(price !== undefined && { price }),
      ...(is_sold !== undefined && { is_sold }),
      ...(is_deleted !== undefined && { is_deleted }),
      ...(visible_in_portfolio !== undefined && { visible_in_portfolio }),
      ...(id_category !== undefined && { id_category }),
      ...(id_series !== undefined && { id_series }),
    });

    // actualizar colores si vienen
    if (colors !== undefined) {
      await product.setColors(colors);
    }

    // actualizar keywords si vienen
    if (keywords !== undefined) {
      await product.setKeywords(keywords);
    }

    return successResponse(res, product.get({ plain: true }), "admin_updateProduct");
  } catch (error) {
    console.error("🔴 Error admin updateProduct:", error);
    return errorResponse(res, "server_error", "Error interno del servidor.", "admin_updateProduct", 500);
  }
};

module.exports = updateProduct;