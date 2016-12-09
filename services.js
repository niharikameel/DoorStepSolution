
var Sequelize = require('sequelize');
var ServiceProvider = require('../models/serviceproviders').ServiceProvider;
var connection = require('../config/database').connection;
var Service = connection.define('Service', {
    name: Sequelize.STRING,
    parent_id: Sequelize.INTEGER
});

Service.hasMany(ServiceProvider,{foreignKey: 'services_id'})
//Service.sync()
module.exports.Service = Service