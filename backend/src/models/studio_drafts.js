const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const StudioDrafts = sequelize.define("StudioDrafts", {
        id_studio_draft: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        format: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        elements: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        background_image_url: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        id_product: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: "studio_drafts",
        timestamps: false,
        freezeTableName: true,
    });

    return StudioDrafts;
};