const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ProductImages = sequelize.define("ProductImages", {
    id_image: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    id_product: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Products",
        key: "id_product"
      }
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    image_type: {
      type: DataTypes.ENUM('cover', 'banner', 'gallery'),
      allowNull: false,
      defaultValue: 'gallery',
    },
    watermark_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
  }, {
    tableName: "product_images",
    timestamps: false,
    freezeTableName: true
  });

  return ProductImages;
};