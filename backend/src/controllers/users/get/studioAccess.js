const { Users } = require("../../../database/indexModels");
const { successResponse, errorResponse } = require("../../../utils/responseHelper");

const studioAccess = async (req, res) => {
    try {
        const id_user = req.user.id_user;

        const user = await Users.findByPk(id_user, {
            attributes: ["id_user", "studio_expires_at"]
        });

        if (!user) {
            return errorResponse(res, "not_found", "Usuario no encontrado.", "users/studioAccess", 404);
        }

        const now = new Date();
        const hasAccess = user.studio_expires_at && new Date(user.studio_expires_at) > now;
        const expiresAt = user.studio_expires_at || null;

        return successResponse(res, { hasAccess, expiresAt }, "users/studioAccess");

    } catch (error) {
        console.error("Error al verificar acceso al studio:", error);
        return errorResponse(res, "server_error", "Error interno del servidor.", "users/studioAccess", 500);
    }
};

module.exports = studioAccess;