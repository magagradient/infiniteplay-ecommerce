const {
  Products,
  Categories,
  Series,
  Keywords,
  Styles,
  Colors,
  Themes,
  ProductImages
} = require("../../../database/indexModels");

const { successResponse, errorResponse } = require("../../../utils/responseHelper");

const show = async (req, res) => {
  try {
    const product = await Products.findOne({
      where: { id_product: req.params.id, is_deleted: false },
          attributes: {
              exclude: ['created_at', 'updated_at']
          },
          include: [
              { model: Categories, as: "category" },
              { model: Series, as: "series" },

              {
                  model: ProductImages,
                  as: "images",
                  separate: true,
                  order: [["id_image", "ASC"]]
              },

              { model: Keywords, as: "keywords", through: { attributes: [] } },
              { model: Styles, as: "styles", through: { attributes: [] } },
              { model: Colors, as: "colors", through: { attributes: [] } },
              { model: Themes, as: "themes", through: { attributes: [] } }
          ]
      });

      if (!product) {
          return errorResponse(
              res,
              "not_found",
              "Producto no encontrado.",
              "products_show",
              404
          );
      }

      return successResponse(
          res,
          { product, source: "products/:id" },
          "products_show"
      );

  } catch (error) {
      console.error("Error al obtener producto:", error);
      return errorResponse(
          res,
          "server_error",
          "Error interno del servidor",
          "products_show",
          500
      );
  }
};

module.exports = show;