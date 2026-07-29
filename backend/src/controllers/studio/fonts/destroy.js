const { StudioFonts } = require("../../../database/indexModels");

module.exports = async (req, res) => {
    try {
        const deleted = await StudioFonts.destroy({ where: { id_studio_font: req.params.id } });
        if (!deleted) return res.status(404).json({ message: "Fuente no encontrada" });
        return res.status(200).json({ message: "Fuente eliminada" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al eliminar la fuente" });
    }
};