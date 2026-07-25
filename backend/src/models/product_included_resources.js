const { DataTypes, Sequelize } = require("sequelize");

module.exports = (sequelize) => {
  const ProductIncludedResources = sequelize.define(
    "ProductIncludedResources",
    {
      id_resource: {
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

      id_category: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "categories",
          key: "id_category",
        },
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
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
      tableName: "product_included_resources",
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    }
  );

  return ProductIncludedResources;
};