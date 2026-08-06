"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("orders", "subtotal", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      comment: "Suma de los productos antes de aplicar descuentos",
    });

    await queryInterface.addColumn("orders", "discount_total", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
      comment: "Monto total descontado (ej: por descuento de serie)",
    });

    await queryInterface.addColumn("orders_products", "applied_discount_percentage", {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: true,
      defaultValue: 0,
      comment: "% de descuento por serie aplicado a esta línea, si corresponde",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("orders_products", "applied_discount_percentage");
    await queryInterface.removeColumn("orders", "discount_total");
    await queryInterface.removeColumn("orders", "subtotal");
  },
};