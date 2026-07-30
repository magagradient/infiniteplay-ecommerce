const { DataTypes, Sequelize } = require("sequelize");

module.exports = (sequelize) => {
  const PricingRules = sequelize.define(
    "PricingRules",
    {
      id_pricing_rule: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      id_category: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "categories",
          key: "id_category",
        },
      },

      artwork_level: {
        type: DataTypes.ENUM("core", "signature", "premium"),
        allowNull: false,
      },

      suggested_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
      tableName: "pricing_rules",
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    }
  );

  return PricingRules;
};