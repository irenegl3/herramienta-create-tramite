'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Plans', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      nombre: {
        type: Sequelize.STRING
      },
      acronimo: {
        type: Sequelize.STRING
      }
    },
      {
        timestamps: false
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Plans')
  }
};
