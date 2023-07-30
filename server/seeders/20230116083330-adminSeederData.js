'use strict';
const role = require('../config/user.roles');
const uuid = require('uuid');
 require('dotenv').config({ path: require('find-config')('.env') });
 const bcrypt = require('bcrypt')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Employees', [{
      id:uuid.v4(),
      name: 'Zahid Aziz',
      designation: 'CEO',
      email: process.env.SUPER_ADMIN_EMAIL,
      password:await bcrypt.hash('trSuxess***888', 10),
      deviceId:1,
      role:'1234',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('employees', null, {});
  }
};
