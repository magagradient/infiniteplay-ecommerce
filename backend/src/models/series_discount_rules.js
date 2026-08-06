const { DataTypes, Sequelize } = require("sequelize");

module.exports = (sequelize) => {
  const SeriesDiscountRules = sequelize.define(
    "SeriesDiscountRules",
    {
      id_discount_rule: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      min_pieces: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      discount_percentage: {
        type: DataTypes.DECIMAL(5, 2),
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
      tableName: "series_discount_rules",
      timestamps: true,
      underscored: true,
      freezeTableName: true,
    }
  );

  return SeriesDiscountRules;
};