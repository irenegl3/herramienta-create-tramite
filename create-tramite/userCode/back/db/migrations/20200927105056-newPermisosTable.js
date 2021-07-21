'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Alter commands 
      const t = await queryInterface.sequelize.transaction();

      //borrar columna
      await queryInterface.removeColumn('Permisos', 'id', { transaction: t });
      
      // Anadir columna
      await queryInterface.addColumn(
        'Permisos',
        'email',
        Sequelize.STRING,
        { transaction: t }
      )

       // Anadir columna
       await queryInterface.addColumn(
        'Permisos',
        'tramite',
        Sequelize.STRING,
        { transaction: t }
      )

      // Pk compuesta
      await queryInterface.sequelize.query('ALTER TABLE "Permisos" ADD CONSTRAINT "rol" PRIMARY KEY ("email", "tramite")',
      { transaction:t
      })
  
      await t.commit();
    } catch (error) {
      console.error(error);
      if (t) {
        await t.rollback();
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      const t = await queryInterface.sequelize.transaction();
      // Reverting commands
      await queryInterface.removeColumn('Permisos', 'email', { transaction: t });
      await queryInterface.removeColumn('Permisos', 'tramite', { transaction: t });
      await queryInterface.bulkDelete('Permisos', null, {transaction: t});
      await queryInterface.addColumn(
        'Permisos',
        'id',{
          type:  Sequelize.STRING,
          primaryKey: true
        },
        { transaction: t }
      )
      await t.commit();
    } catch (error) {

      console.log(error);
      if (t) {
        await t.rollback();
      }
    }
  }
}
