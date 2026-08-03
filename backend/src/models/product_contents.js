module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "ProductContents",
    {
      id_product_content: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      id_product: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      id_category: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },

      created_at: {
        type: DataTypes.DATE,
      },

      updated_at: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "product_contents",
      timestamps: false,
    }
  );
};