const { Products, ProductTechnicalDetails } = require("../../../database/indexModels");
const { successResponse, errorResponse } = require("../../../utils/responseHelper");

const create = async (req, res) => {
    try {
        const { id } = req.params; // id_product
        const { label, value, is_visible, sort_order } = req.body;

        if (!label || !value) {
            return errorResponse(res, "bad_request", "Faltan campos obligatorios: label y value.", "admin_createTechnicalDetail", 400);
        }

        const product = await Products.findByPk(id);
        if (!product) {
            return errorResponse(res, "not_found", `El producto con id ${id} no existe.`, "admin_createTechnicalDetail", 404);
        }

        const newDetail = await ProductTechnicalDetails.create({
            id_product: id,
            label,
            value,
            is_visible: is_visible ?? true,
            sort_order: sort_order ?? 0,
        });

        return successResponse(res, newDetail, "admin_createTechnicalDetail", 201);
    } catch (error) {
        console.error("🔴 Error admin createTechnicalDetail:", error);
        return errorResponse(res, "server_error", "Error interno del servidor.", "admin_createTechnicalDetail", 500);
    }
};

module.exports = create;