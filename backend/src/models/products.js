const { DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  const Products = sequelize.define('Products', {
    id_product: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description_long: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    is_sold: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    visible_in_portfolio: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    sold_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    is_customizable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    customization_fields: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null
      // Ej: ["title", "artist", "date", "location"]
      // Si is_customizable es true pero este campo está vacío,
      // el checkout puede asumir un default (ej: ["title", "artist"])
    },
    id_category: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id_category'
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    id_series: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'series',
        key: 'id_series'
      }
    }
  }, {
    tableName: 'products',
    timestamps: true,
    underscored: true,
    paranoid: false,
    freezeTableName: true
  });

  return Products;
};