'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'artwork_level', {
      type: Sequelize.ENUM('experimental', 'signature', 'premium'),
      allowNull: false,
      defaultValue: 'experimental'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('products', 'artwork_level');
  }
};