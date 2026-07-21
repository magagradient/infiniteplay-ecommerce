const { Products, Categories, Series } = require("../../../database/indexModels");
const { successResponse, errorResponse } = require("../../../utils/responseHelper");

const create = async (req, res) => {
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
            customization_fields
        } = req.body;

        if (!title || price === undefined || id_category === undefined) {
            return errorResponse(res, "bad_request", "Faltan campos obligatorios: title, price e id_category.", "products/create", 400);
        }

        // Validar que la categoría exista
        const categoryExists = await Categories.findByPk(id_category);
        if (!categoryExists) {
            return errorResponse(res, "bad_request", `La categoría con id ${id_category} no existe.`, "products/create", 400);
        }

        // Validar que la serie exista, solo si viene id_series
        if (id_series !== undefined && id_series !== null) {
            const seriesExists = await Series.findByPk(id_series);
            if (!seriesExists) {
                return errorResponse(res, "bad_request", `La serie con id ${id_series} no existe.`, "products/create", 400);
            }
        }

        // Validar que, si es personalizable, customization_fields sea un array válido
        if (is_customizable && customization_fields !== undefined && customization_fields !== null) {
            const validFields = ["title", "artist", "date", "location"];
            const isValidArray = Array.isArray(customization_fields) &&
                customization_fields.every((f) => validFields.includes(f));
            if (!isValidArray) {
                return errorResponse(
                    res,
                    "bad_request",
                    `customization_fields debe ser un array con valores válidos: ${validFields.join(", ")}.`,
                    "products/create",
                    400
                );
            }
        }

        // Crear producto si todo ok
        const newProduct = await Products.create({
            title,
            description,
            description_long,
            price,
            is_sold: is_sold ?? false,
            sold_at,
            id_category,
            id_series: id_series ?? null,
            is_customizable: is_customizable ?? false,
            customization_fields: is_customizable ? (customization_fields ?? null) : null
        });

        const createdProduct = await Products.findByPk(newProduct.id_product, {
            include: [
                { model: Categories, as: "category" },
                { model: Series, as: "series" }
            ]
        });

        return successResponse(res, createdProduct, "products/create");
    } catch (error) {
        console.error("Error al crear producto:", error);
        return errorResponse(res, "server_error", "Error interno del servidor", "products/create", 500);
    }
};

module.exports = create;