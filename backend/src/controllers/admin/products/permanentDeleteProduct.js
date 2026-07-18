const {
  Products,
  ProductImages,
  ProductColors,
  ProductStyles,
  ProductThemes,
  ProductKeywords,
  FavoriteProducts,
  sequelize,
} = require("../../../database/indexModels");
const { successResponse, errorResponse } = require("../../../utils/responseHelper");

const permanentDeleteProduct = async (req, res) => {
  const { id } = req.params;
  const t = await sequelize.transaction();

  try {
    const product = await Products.findByPk(id, { transaction: t });

    if (!product) {
      await t.rollback();
      return errorResponse(res, "not_found", "Producto no encontrado.", "admin_permanentDeleteProduct", 404);
    }

    if (!product.is_deleted) {
      await t.rollback();
      return errorResponse(res, "conflict", "El producto debe estar eliminado (soft delete) antes de poder borrarse permanentemente.", "admin_permanentDeleteProduct", 409);
    }

    // Limpiar relaciones livianas antes del hard delete
    await ProductImages.destroy({ where: { id_product: id }, transaction: t });
    await ProductColors.destroy({ where: { id_product: id }, transaction: t });
    await ProductStyles.destroy({ where: { id_product: id }, transaction: t });
    await ProductThemes.destroy({ where: { id_product: id }, transaction: t });
    await ProductKeywords.destroy({ where: { id_product: id }, transaction: t });
    await FavoriteProducts.destroy({ where: { id_product: id }, transaction: t });

    await product.destroy({ transaction: t });

    await t.commit();

    return successResponse(res, { id_product: id }, "admin_permanentDeleteProduct");
  } catch (error) {
    await t.rollback();
    console.error("🔴 Error admin permanentDeleteProduct:", error);
    return errorResponse(res, "server_error", "Error interno del servidor.", "admin_permanentDeleteProduct", 500);
  }
};

module.exports = permanentDeleteProduct;
