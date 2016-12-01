var express = require('express');
var path = require('path');
var mysql = require('mysql');
var app = express();;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var routes = require('./routes');
var bcrypt = require('bcryptjs');
var flash = require('connect-flash')
var passport = require('passport');
var LocalStrategy = require('passport-local'),Strategy;
var expressValidator = require('express-validator');

var Sequelize = require('sequelize');
var connection = new Sequelize('doorstepsolutions', 'root', 'qwerty12345',{
  dialect: 'mysql'
});

var User = connection.define('user', {
  first_name: Sequelize.STRING,
  last_name: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  DOB: Sequelize.DATE,
  gender: Sequelize.STRING
}
);

connection.sync();

var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.set('port', 1327);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(expressValidator());
app.use(bodyParser());

app.use('/img',express.static(path.join(__dirname, 'public/images')));
app.use('/js',express.static(path.join(__dirname, 'public/javascripts')));
app.use('/css',express.static(path.join(__dirname, 'public/stylesheets')));
app.use(session({
  secret:'secret',
  saveUninitialized:true,
  resave:true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.all(function(req,res,next){
  req.locals.success_msg=req.flash('success_msg');
  req.locals.error_msg=req.flash('error_msg');
  req.locals.error=req.flash('error');
  next();
});
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;
 
    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
 

app.get('/',routes.home);
app.post('/login',urlencodedParser,routes.login)
app.post('/signup', urlencodedParser, routes.signup)
app.get('/home_maintance',routes.home_maintance)
app.get('/child_care',routes.child_care)
app.get('/cooking',routes.cooking)
app.get('/elder_care',routes.elder_care)
app.get('/tutors',routes.tutors)
app.get('/event_planner',routes.event_planner)
app.listen(process.env.PORT || 1327);
console.log('Express server listening on port ' + app.get('port'));