const { Sequelize } = require('sequelize');
const path = require('path');

// Create a new Sequelize instance with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../data/blog.sqlite'),
  logging: false // Set to true to see SQL queries in console
});

module.exports = sequelize; 