const { StudioFonts } = require("../../../database/indexModels");

module.exports = async (req, res) => {
    try {
        const { name, google_font_name } = req.body;
        if (!name || !google_font_name) {
            return res.status(400).json({ message: "Faltan datos: name y google_font_name son obligatorios" });
        }
        const font = await StudioFonts.create({ name, google_font_name });
        return res.status(201).json(font);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al crear la fuente" });
    }
};