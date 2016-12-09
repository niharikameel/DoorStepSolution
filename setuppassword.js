var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user').User;
// Serialize sessions
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    User.find({where: {id: user.id}}).success(function(user){
        done(null, user);
    }).error(function(err){
        done(err, null);
    });
});

// Use local strategy to create user account
passport.use(new LocalStrategy(
    function(email, password, done) {
        User.find({ where: { email: email }}).success(function(user) {
            passwd= user ? user.password :''
            isMatch = User.validPassword(password, passwd,done,user)

        });
    }
));



