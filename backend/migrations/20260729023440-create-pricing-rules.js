"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pricing_rules", {
      id_pricing_rule: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      id_category: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "categories",
          key: "id_category",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      artwork_level: {
        type: Sequelize.ENUM("core", "signature", "premium"),
        allowNull: false,
      },

      suggested_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addConstraint("pricing_rules", {
      fields: ["id_category", "artwork_level"],
      type: "unique",
      name: "unique_category_artwork_level",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("pricing_rules");
  },
};