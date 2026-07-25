const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const StudioResources = sequelize.define("StudioResources", {
        id_studio_resource: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        url: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        id_studio_category: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: "studio_resources",
        timestamps: false,
        freezeTableName: true,
    });

    return StudioResources;
};