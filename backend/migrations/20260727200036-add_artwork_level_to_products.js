'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'artwork_level', {
      type: Sequelize.ENUM('core', 'signature', 'premium'),
      allowNull: false,
      defaultValue: 'core'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('products', 'artwork_level');
  }
};