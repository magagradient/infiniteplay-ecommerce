"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("series_discount_rules", {
      id_discount_rule: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      min_pieces: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        comment: "Cantidad mínima de piezas de la misma serie para que aplique este descuento",
      },
      discount_percentage: {
        type: Sequelize.DECIMAL(5, 2),
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable("series_discount_rules");
  },
};