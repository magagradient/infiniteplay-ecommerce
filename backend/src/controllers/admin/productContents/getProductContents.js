const { ProductContents, Categories } = require("../../../database/indexModels");
const responseHelper = require("../../../utils/responseHelper");

const getProductContents = async (req, res) => {
  const { id } = req.params;

  try {
    const contents = await ProductContents.findAll({
      where: { id_product: id },
      include: [
        {
          model: Categories,
          as: "category",
          attributes: ["id_category", "name"],
        },
      ],
      order: [["id_product_content", "ASC"]],
    });

    return responseHelper.successResponse(
      res,
      contents,
      "product_contents_get"
    );

  } catch (error) {
    console.error(error);

    return responseHelper.errorResponse(
      res,
      "server_error",
      error.message,
      "product_contents_get",
      500
    );
  }
};

module.exports = getProductContents;