var Sequelize = require('sequelize');
var connection = new Sequelize('doorstepsolutions', 'root', 'qwerty12345',{
    dialect: 'mysql'
});

connection.sync();
module.exports.connection=connection;