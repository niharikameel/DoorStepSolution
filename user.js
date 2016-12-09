var bcrypt = require('bcryptjs');
//var bcrypt = require('bcrypt');
var Sequelize = require('sequelize');
var connection = require('../config/database').connection;
var User = connection.define('user', {
        first_name: Sequelize.STRING,
        last_name: Sequelize.STRING,
        email: {
            type:Sequelize.STRING,
            unique:true
        },
        password: Sequelize.STRING,
        DOB: Sequelize.DATE,
        gender: Sequelize.STRING
    },
    {
        classMethods: {
            validPassword: function(password,passwd,done,user){
                bcrypt.compare(password,passwd, function(err,isMatch){
                    if (err) console.log(err);
                    if(isMatch){
                        return done(null,user)
                    }else{
                        return done(null,false,{message:'Invalid Email or Passwprd'})
                    }
                })
            }
        }
    });

User.beforeCreate(function (user, options,cb) {
    bcrypt.hash(user.password, 10, function(err, hash) {
        user.password = hash;
        return cb(null, options);
    });
});

module.exports.User = User