const { ProductContents } = require("../../../database/indexModels");
const responseHelper = require("../../../utils/responseHelper");

const updateProductContent = async (req, res) => {
  const { id_product_content } = req.params;
  const { id_category, quantity } = req.body;

  try {
    const productContent = await ProductContents.findByPk(id_product_content);

    if (!productContent) {
      return responseHelper.errorResponse(
        res,
        "product_content_not_found",
        "No se encontró el contenido del producto.",
        "product_content_update",
        404
      );
    }

    await productContent.update({
      id_category,
      quantity,
    });

    return responseHelper.successResponse(
      res,
      productContent,
      "product_content_update"
    );

  } catch (error) {
    console.error(error);

    return responseHelper.errorResponse(
      res,
      "server_error",
      error.message,
      "product_content_update",
      500
    );
  }
};

module.exports = updateProductContent;