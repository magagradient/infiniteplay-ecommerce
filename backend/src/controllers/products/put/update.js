const { Products, Categories, Series, Colors, Styles, Themes, Keywords } = require("../../../database/indexModels");
const { successResponse, errorResponse } = require("../../../utils/responseHelper");


const update = async (req, res) => {
    try {
        const {
            title,
            description,
            description_long,
            price,
            is_sold,
            sold_at,
            id_category,
            id_series,
            is_customizable,
            customization_fields,
            keywords,
            colors,
            styles,
            themes
        } = req.body;  // ya validado

        const product = await Products.findByPk(req.params.id);
        if (!product) {
            return errorResponse(res, "not_found", "Producto no encontrado.", "products/update", 404);
        }

        // Validar customization_fields si viene y el producto queda/está marcado como personalizable
        const willBeCustomizable = is_customizable !== undefined ? is_customizable : product.is_customizable;
        if (willBeCustomizable && customization_fields !== undefined && customization_fields !== null) {
            const validFields = ["title", "artist", "date", "location"];
            const isValidArray = Array.isArray(customization_fields) &&
                customization_fields.every((f) => validFields.includes(f));
            if (!isValidArray) {
                return errorResponse(
                    res,
                    "bad_request",
                    `customization_fields debe ser un array con valores válidos: ${validFields.join(", ")}.`,
                    "products/update",
                    400
                );
            }
        }

        if (title !== undefined) product.title = title;
        if (description !== undefined) product.description = description;
        if (description_long !== undefined) product.description_long = description_long;
        if (price !== undefined) product.price = price;
        if (is_sold !== undefined) product.is_sold = is_sold;
        if (sold_at !== undefined) product.sold_at = sold_at;
        if (id_category !== undefined) product.id_category = id_category;
        if (id_series !== undefined) product.id_series = id_series;
        if (is_customizable !== undefined) product.is_customizable = is_customizable;
        if (customization_fields !== undefined) {
            product.customization_fields = willBeCustomizable ? customization_fields : null;
        }
        // Si se desmarca is_customizable en este mismo update, limpiar los campos aunque no vengan explícitos
        if (is_customizable === false) product.customization_fields = null;

        await product.save();

        if (Array.isArray(colors)) await product.setColors(colors);
        if (Array.isArray(styles)) await product.setStyles(styles);
        if (Array.isArray(themes)) await product.setThemes(themes);
        if (Array.isArray(keywords)) await product.setKeywords(keywords);

        const updatedProduct = await Products.findByPk(product.id_product, {
            attributes: { exclude: ["created_at", "updated_at"] },
            include: [
                { model: Categories, as: "category", attributes: { exclude: ["created_at", "updated_at"] } },
                { model: Series, as: "series", attributes: { exclude: ["created_at", "updated_at"] } },
                { model: Colors, as: "colors", attributes: ["id_color", "name"] },
                { model: Styles, as: "styles", attributes: ["id_style", "name"] },
                { model: Themes, as: "themes", attributes: ["id_theme", "name"] },
                { model: Keywords, as: "keywords", attributes: ["id_keyword", "name"] },
            ],
        });

        return successResponse(res, updatedProduct, "products/update");
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        return errorResponse(res, "server_error", "Error interno del servidor", "products/update", 500, {
            description: error.message,
        });
    }
};


module.exports = update;