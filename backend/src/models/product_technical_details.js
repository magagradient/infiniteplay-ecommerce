const { DataTypes, Sequelize } = require("sequelize");

module.exports = (sequelize) => {
  const ProductTechnicalDetails = sequelize.define(
    "ProductTechnicalDetails",
    {
      id_detail: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_product: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "products",
          key: "id_product",
        },
      },
      label: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      is_visible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      sort_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
      },
    },
    {
      tableName: "product_technical_details",
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    }
  );

  return ProductTechnicalDetails;
};