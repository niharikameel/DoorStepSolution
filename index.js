var bcrypt = require('bcryptjs');
var Sequelize = require('sequelize');
var connection = new Sequelize('doorstepsolutions', 'root', 'qwerty12345',{
  dialect: 'mysql'
});

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
  hooks: {
    beforeCreate: function(user, options, cb) {
      bcrypt.hash(user.password, 10, function(err, hash) {
        user.password = hash;

        return cb(null, options);
      });
    },
  }
});

connection.sync();

exports.home = function(req, res) {
res.render('index',{
    errors: '',
    success_msg: req.flash('success_msg'),
    error_msg: req.flash('errror_msg'),
    error: req.flash('error') 
      });
};



exports.home_maintance = function(req, res) {
res.render('HomeMaintance',{
    title: 'Home Maintance Service'
      });
};

exports.child_care = function(req, res) {
res.render('Childcare',{
    title: 'ChildCare Service'
      });
};

exports.elder_care = function(req, res) {
res.render('ElderCare',{
    title: 'ElderCare Service'
      });
};

exports.cooking = function(req, res) {
res.render('Cooking',{
    title: 'Cooking Service'
      });
};

exports.event_planner = function(req, res) {
res.render('EventManagemant',{
    title: 'Event Planner Services'
      });
};

exports.tutors = function(req, res) {
res.render('TutorService',{
    title: 'Tutor Services'
      });
};



exports.login= function(req,res){
req.checkBody('email','email is not valid').isEmail();
req.checkBody('password','Password is required').notEmpty();
var errors=req.validationErrors();
if (errors){
console.log("validation login failures");
}else{
  console.log("validation login success");
}

 if (req.session.username & req.session.password != null) {
     res.send('already loggedin');
    } else {
 var sign=connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [req.body.username,req.body.password], function(err,res){
   if(!!err){
 console.log("login fail");
      }
      else
      {
  console.log("login success");
  req.session.username = req.body.username;
  req.session.password = req.body.password;

      }
 });
if(sign){
    res.send('logedin successful');
}
else{
res.send('loggedin unsuccessful');
}
    }
};

exports.signup= function(req,res) {
   
     var first_name = req.body.first_name;
      var last_name = req.body.last_name;
      var email = req.body.email;
      var password = req.body.password;
      var confirmation_password = req.body.confirmation_password;
      var DOB = req.body.DOB;
      var gender = req.body.gender;
  

//validations
req.checkBody('first_name','first Name is required').notEmpty();
req.checkBody('last_name','last Name is required').notEmpty();
req.checkBody('email','email is not valid').isEmail();
req.checkBody('password','Password is required').notEmpty();
req.checkBody('confirmation_password','Password is do not match').equals(req.body.password);
req.checkBody('DOB','Date of Birth is required').notEmpty();

var errors=req.validationErrors();
if (errors){
console.log("validation failures");
console.log(errors);
res.render('index',{
    errors: errors,
    success_msg: req.flash('success_msg'),
    error_msg: req.flash('errror_msg'),
    error: req.flash('error') 
      });
}else{
  console.log("validation success");
var user = User.build({
 first_name:first_name,
 last_name:last_name,
 email:email,
 password:password,
 DOB:DOB,
 gender:gender
   })

    user.save().then(function(err) {
  if(err){
console.log(err);
  }
  req.flash('success_msg','you are registerd and you can now login');
   res.redirect('/');
 });
  
}

};