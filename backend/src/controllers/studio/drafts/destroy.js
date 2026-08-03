const cloudinary = require("../../../../config/cloudinary");
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

        // borrar del canvas también las imágenes propias que haya en los elementos (recursos subidos por el usuario)
        const urlsToDelete = [];
        if (draft.background_image_url) urlsToDelete.push(draft.background_image_url);
        (draft.elements || []).forEach(el => {
            if (el.type === "resource" && el.src?.includes("studio/user-resources")) {
                urlsToDelete.push(el.src);
            }
        });

        for (const url of urlsToDelete) {
            const match = url.match(/upload\/(?:v\d+\/)?(.+)\.\w+$/);
            if (match) {
                await cloudinary.uploader.destroy(match[1]).catch(() => {});
            }
        }

        await draft.destroy();

        return successResponse(res, { message: "Borrador eliminado" }, "studio/drafts/destroy");
    } catch (error) {
        console.error("Error al eliminar borrador del studio:", error);
        return errorResponse(res, "server_error", "Error interno del servidor.", "studio/drafts/destroy", 500);
    }
};

module.exports = destroy;