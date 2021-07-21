'use strict';
const { UniqueConstraintError } = require('sequelize');

module.exports = {
  up: async queryInterface => {
    try {
      await queryInterface.bulkInsert('Permisos', [
        {
          email: 'elena.garcia.leal@upm.es',
          tramite: 'gestion-certificados'
        }, 
        {
          email: 'andres.cosano@upm.es',
          tramite: 'gestion-certificados'
        },
        {
          email: 'elena.garcia.leal@upm.es',
          tramite: 'gestion-titulos'
        }, 
        {
          email: 'andres.cosano@upm.es',
          tramite: 'gestion-titulos'
        },
        {
          email: 'mariaantonia.barquero@upm.es',
          tramite: 'gestion-titulos'
        },
        {
          email: 'cristina.perezdeazpillaga@upm.es',
          tramite: 'gestion-titulos'
        },
        {
          email: 'pilar.horcajada@upm.es',
          tramite: 'gestion-titulos'
        },
        {
          email: 'esther.fuentes@upm.es',
          tramite: 'gestion-titulos'
        },
        {
          email: 'mercedes.obispo@upm.es',
          tramite: 'gestion-titulos'
        },
        {
          email: 'isabel.poza@upm.es',
          tramite: 'gestion-titulos'
        },
        {
          email: 'elena.garcia.leal@upm.es',
          tramite: 'evaluacion-curricular'
        }, 
        {
          email: 'andres.cosano@upm.es',
          tramite: 'evaluacion-curricular'
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
