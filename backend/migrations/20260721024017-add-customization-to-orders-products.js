"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("orders_products", "custom_title", {
      type: Sequelize.STRING(200),
      allowNull: true,
    });

    await queryInterface.addColumn("orders_products", "custom_artist_name", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.addColumn("orders_products", "event_date", {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });

    await queryInterface.addColumn("orders_products", "event_location", {
      type: Sequelize.STRING(200),
      allowNull: true,
    });

    await queryInterface.addColumn("orders_products", "custom_notes", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("orders_products", "fulfillment_status", {
      type: Sequelize.ENUM("not_applicable", "pending_customization", "ready"),
      allowNull: false,
      defaultValue: "not_applicable",
    });

    await queryInterface.addColumn("orders_products", "final_file_url", {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "URL del archivo final editado, subido por el admin cuando fulfillment_status = ready",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("orders_products", "final_file_url");
    await queryInterface.removeColumn("orders_products", "fulfillment_status");
    await queryInterface.removeColumn("orders_products", "custom_notes");
    await queryInterface.removeColumn("orders_products", "event_location");
    await queryInterface.removeColumn("orders_products", "event_date");
    await queryInterface.removeColumn("orders_products", "custom_artist_name");
    await queryInterface.removeColumn("orders_products", "custom_title");

    // Sequelize crea un tipo ENUM en Postgres que hay que dropear a mano si se revierte.
    // Si usás MySQL, esta línea no hace falta y se puede borrar.
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_orders_products_fulfillment_status";'
    );
  },
};
