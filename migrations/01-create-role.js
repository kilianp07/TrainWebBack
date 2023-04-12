'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      value: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      isDeleted:{
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    });
    return queryInterface.bulkInsert('roles', [{
      value: 'STUDENT',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      value: 'TEACHER',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      value: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Roles');
  }
};