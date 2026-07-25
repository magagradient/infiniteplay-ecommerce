const { Products, Categories, ProductIncludedResources } = require("../../../database/indexModels");
const { successResponse, errorResponse } = require("../../../utils/responseHelper");

const create = async (req, res) => {
    try {
        const { id } = req.params; // id_product
        const { id_category, quantity } = req.body;

        if (!id_category) {
            return errorResponse(res, "bad_request", "Falta id_category.", "admin_createIncludedResource", 400);
        }

        const product = await Products.findByPk(id);
        if (!product) {
            return errorResponse(res, "not_found", `El producto con id ${id} no existe.`, "admin_createIncludedResource", 404);
        }

        const category = await Categories.findByPk(id_category);
        if (!category) {
            return errorResponse(res, "not_found", `La categoría con id ${id_category} no existe.`, "admin_createIncludedResource", 404);
        }

        const newResource = await ProductIncludedResources.create({
            id_product: id,
            id_category,
            quantity: quantity ?? 1,
        });

        const withCategory = await ProductIncludedResources.findByPk(newResource.id_resource, {
            include: [{ model: Categories, as: "category", attributes: ["id_category", "name"] }],
        });

        return successResponse(res, withCategory, "admin_createIncludedResource", 201);
    } catch (error) {
        console.error("🔴 Error admin createIncludedResource:", error);
        return errorResponse(res, "server_error", "Error interno del servidor.", "admin_createIncludedResource", 500);
    }
};

module.exports = create;