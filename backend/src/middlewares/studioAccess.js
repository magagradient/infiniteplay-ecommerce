// middlewares/studioAccess.js
const { Users } = require("../database/indexModels");

const studioAccess = async (req, res, next) => {
    try {
        const { id_user } = req.user;

        const user = await Users.findByPk(id_user, {
            attributes: ["id_user", "studio_expires_at"],
        });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const hasAccess = user.studio_expires_at && new Date(user.studio_expires_at) > new Date();

        if (!hasAccess) {
            return res.status(403).json({ message: "No tenés acceso vigente al studio" });
        }

        return next();
    } catch (error) {
        console.error("Error al validar acceso al studio:", error);
        return res.status(500).json({ message: "Error al validar el acceso al studio" });
    }
};

module.exports = studioAccess;