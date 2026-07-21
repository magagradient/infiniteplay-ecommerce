"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("orders_products", "event_date", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("orders_products", "event_date", {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
  },
};
