const { StudioFonts } = require("../../../database/indexModels");

module.exports = async (req, res) => {
    try {
        const fonts = await StudioFonts.findAll({ order: [["name", "ASC"]] });
        return res.status(200).json(fonts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener las fuentes del studio" });
    }
};