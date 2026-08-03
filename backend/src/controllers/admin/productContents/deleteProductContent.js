const { ProductContents } = require("../../../database/indexModels");
const responseHelper = require("../../../utils/responseHelper");

const deleteProductContent = async (req, res) => {
  const { id_product_content } = req.params;

  try {
    const productContent = await ProductContents.findByPk(id_product_content);

    if (!productContent) {
      return responseHelper.errorResponse(
        res,
        "product_content_not_found",
        "No se encontró el contenido del producto.",
        "product_content_delete",
        404
      );
    }

    await productContent.destroy();

    return responseHelper.successResponse(
      res,
      null,
      "product_content_delete"
    );

  } catch (error) {
    console.error(error);

    return responseHelper.errorResponse(
      res,
      "server_error",
      error.message,
      "product_content_delete",
      500
    );
  }
};

module.exports = deleteProductContent;