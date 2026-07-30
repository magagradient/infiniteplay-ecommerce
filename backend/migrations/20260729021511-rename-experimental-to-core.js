'use strict';

module.exports = {
  async up(queryInterface) {

    // Ampliamos temporalmente el ENUM
    await queryInterface.sequelize.query(`
      ALTER TABLE products
      MODIFY artwork_level ENUM(
        'experimental',
        'core',
        'signature',
        'premium'
      ) NOT NULL DEFAULT 'experimental';
    `);

    // Actualizamos los datos
    await queryInterface.sequelize.query(`
      UPDATE products
      SET artwork_level = 'core'
      WHERE artwork_level = 'experimental';
    `);

    // Dejamos el ENUM definitivo
    await queryInterface.sequelize.query(`
      ALTER TABLE products
      MODIFY artwork_level ENUM(
        'core',
        'signature',
        'premium'
      ) NOT NULL DEFAULT 'core';
    `);
  },

  async down(queryInterface) {

    await queryInterface.sequelize.query(`
      ALTER TABLE products
      MODIFY artwork_level ENUM(
        'experimental',
        'core',
        'signature',
        'premium'
      ) NOT NULL DEFAULT 'core';
    `);

    await queryInterface.sequelize.query(`
      UPDATE products
      SET artwork_level = 'experimental'
      WHERE artwork_level = 'core';
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE products
      MODIFY artwork_level ENUM(
        'experimental',
        'signature',
        'premium'
      ) NOT NULL DEFAULT 'experimental';
    `);
  }
};