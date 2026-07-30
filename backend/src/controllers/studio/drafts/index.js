const { StudioDrafts } = require("../../../database/indexModels");
const { successResponse, errorResponse } = require("../../../utils/responseHelper");

const index = async (req, res) => {
    try {
        const drafts = await StudioDrafts.findAll({
            where: { id_user: req.user.id_user },
            order: [["updated_at", "DESC"]],
        });

        return successResponse(res, drafts, "studio/drafts");
    } catch (error) {
        console.error("Error al obtener borradores del studio:", error);
        return errorResponse(res, "server_error", "Error interno del servidor.", "studio/drafts", 500);
    }
};

module.exports = index;