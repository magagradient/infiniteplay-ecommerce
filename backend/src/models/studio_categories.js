const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const StudioCategories = sequelize.define("StudioCategories", {
        id_studio_category: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: "studio_categories",
        timestamps: false,
        freezeTableName: true,
    });

    return StudioCategories;
};