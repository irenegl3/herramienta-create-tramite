'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Permisos', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      }
    },
      {
        timestamps: false
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Permisos')
  }
};

