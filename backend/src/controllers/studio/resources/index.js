// controllers/studio/resources/index.js
const { StudioResources, StudioCategories } = require("../../../database/indexModels");

module.exports = async (req, res) => {
    try {
        const { id_studio_category } = req.query;

        const where = {};
        if (id_studio_category) {
            where.id_studio_category = id_studio_category;
        }

        const resources = await StudioResources.findAll({
            where,
            include: [
                {
                    model: StudioCategories,
                    as: "category",
                    attributes: ["id_studio_category", "name"],
                },
            ],
            order: [["id_studio_category", "ASC"], ["name", "ASC"]],
        });

        return res.status(200).json(resources);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener los recursos del studio" });
    }
};