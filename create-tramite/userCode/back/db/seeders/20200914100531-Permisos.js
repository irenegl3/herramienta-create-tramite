'use strict';
const { UniqueConstraintError } = require('sequelize');

module.exports = {
  up: async queryInterface => {
    try {
      await queryInterface.bulkInsert('Permisos', [
        {
          email: 'tes1@upm.es',
          tramite: 'gestion-certificados'
        }, 
        {
          email: 'test2@upm.es',
          tramite: 'gestion-titulos'
        },
      ]);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        console.warn('Los permisos ya existen');
      } else {
        console.error(error);
      }
    }
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Permisos', null, {});
  }
};
