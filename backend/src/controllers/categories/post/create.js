const { Categories } = require("../../../database/indexModels");
const responseHelper = require("../../../utils/responseHelper");
const createDefaultPricingRules = require("../../../services/pricingRules/createDefaultPricingRules");

const create = async (req, res) => {
    const { name } = req.body;

    try {
        const [category, created] = await Categories.findOrCreate({
            where: { name: name.trim() },
            defaults: { name: name.trim() },
        });

        if (!created) {
            return responseHelper.errorResponse(
                res,
                "duplicate_category",
                `Ya existe una categoría con el nombre '${name}'.`,
                "categories_create",
                409
            );
        }

        // Crear automáticamente las reglas de precio
        await createDefaultPricingRules(category.id_category);

        return responseHelper.successResponse(res, category, "categories_create");

    } catch (error) {
        console.error("Error al crear la categoría:", error);

        return responseHelper.errorResponse(
            res,
            "server_error",
            error.message,
            "categories_create",
            500
        );
    }
};

module.exports = create;
