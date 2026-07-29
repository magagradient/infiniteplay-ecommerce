const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const StudioFonts = sequelize.define("StudioFonts", {
        id_studio_font: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        google_font_name: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: "studio_fonts",
        timestamps: false,
        freezeTableName: true,
    });

    return StudioFonts;
};