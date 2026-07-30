const { StudioDrafts } = require("../../../database/indexModels");
const { successResponse, errorResponse } = require("../../../utils/responseHelper");

const destroy = async (req, res) => {
    try {
        const draft = await StudioDrafts.findByPk(req.params.id);

        if (!draft) {
            return errorResponse(res, "not_found", "Borrador no encontrado.", "studio/drafts/destroy", 404);
        }

        if (draft.id_user !== req.user.id_user) {
            return errorResponse(res, "forbidden", "No podés borrar un borrador que no es tuyo.", "studio/drafts/destroy", 403);
        }

        await draft.destroy();

        return successResponse(res, { message: "Borrador eliminado" }, "studio/drafts/destroy");
    } catch (error) {
        console.error("Error al eliminar borrador del studio:", error);
        return errorResponse(res, "server_error", "Error interno del servidor.", "studio/drafts/destroy", 500);
    }
};

module.exports = destroy;