'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('coupons', 'discount_type', {
      type: Sequelize.ENUM('fixed', 'percentage'),
      allowNull: false,
      defaultValue: 'fixed'
    });

    await queryInterface.addColumn('coupons', 'current_uses', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });

    await queryInterface.addColumn('coupons', 'is_active', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('coupons', 'discount_type');
    await queryInterface.removeColumn('coupons', 'current_uses');
    await queryInterface.removeColumn('coupons', 'is_active');

    // MySQL deja el ENUM tipo huérfano al borrar la columna con removeColumn,
    // pero como acá es un ENUM inline (no un tipo separado como en Postgres),
    // no hace falta un DROP TYPE aparte.
  }
};