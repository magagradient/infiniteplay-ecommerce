const { ProductContents } = require("../../../database/indexModels");
const responseHelper = require("../../../utils/responseHelper");

const createProductContent = async (req, res) => {
  const { id } = req.params;
  const { id_category, quantity } = req.body;

  try {
    const existing = await ProductContents.findOne({
      where: {
        id_product: id,
        id_category,
      },
    });

    if (existing) {
      return responseHelper.errorResponse(
        res,
        "product_content_already_exists",
        "Esta categoría ya fue agregada a este producto.",
        "product_content_create",
        409
      );
    }

    const created = await ProductContents.create({
      id_product: id,
      id_category,
      quantity,
    });

    return responseHelper.successResponse(
      res,
      created,
      "product_content_create"
    );

  } catch (error) {
    console.error(error);

    return responseHelper.errorResponse(
      res,
      "server_error",
      error.message,
      "product_content_create",
      500
    );
  }
};

module.exports = createProductContent;