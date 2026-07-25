"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("studio_categories", {
      id_studio_category: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.createTable("studio_resources", {
      id_studio_resource: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      url: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      id_studio_category: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "studio_categories",
          key: "id_studio_category",
        },
        onDelete: "CASCADE",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("studio_resources");
    await queryInterface.dropTable("studio_categories");
  },
};