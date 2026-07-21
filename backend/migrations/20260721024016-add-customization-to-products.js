"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("products", "is_customizable", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn("products", "customization_fields", {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: null,
      comment:
        "Lista de campos que se piden al comprador para este producto, ej: ['title','artist','date','location']",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("products", "customization_fields");
    await queryInterface.removeColumn("products", "is_customizable");
  },
};
