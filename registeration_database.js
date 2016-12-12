var Sequelize = require('sequelize');
var connection = require('../config/database').connection;
//var Service = require('../models/services').Service;
var ServiceProvider = connection.define('ServiceProvider', {
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    mobile: Sequelize.STRING,
    DOB: Sequelize.DATE,
    city: Sequelize.STRING,
    gender: Sequelize.STRING,
    address: Sequelize.TEXT
});
//ServiceProvider.belongsTo(Service)
//ServiceProvider.sync()
module.exports.ServiceProvider = ServiceProvider