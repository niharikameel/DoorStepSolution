var bcrypt = require('bcryptjs');
//var bcrypt = require('bcrypt');
var User = require('../models/user').User;
var Transport = require('../models/notifier').transport;
var Service = require('../models/services').Service;
var ServiceProvider = require('../models/serviceproviders').ServiceProvider;
exports.home = function(req, res) {

    Service.findAll({ where: {parent_id: 0}}).then(function(services){
        console.log(JSON.stringify(services));
        res.render('index',{
            errors: '',
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg'),
            error: req.flash('error'),
            isAuthenticated: req.isAuthenticated(),
            services: services
        });
    });


};

exports.admin = function(req,res){
    Service.findAll({ where: {parent_id: 0}}).then(function(services){
        console.log(JSON.stringify(services));
        if(services){
            res.render('service',{
                title: 'Admin',
                services: services
            });
        }else{
            res.render('service',{
                title: 'Admin',
                services: services
            });
        }
    });
};

exports.subservices = function(req,res){
    var id=req.params.id;
    Service.findAll({ where: {parent_id: id}}).then(function(services){
        res.send(services);
    });
};

exports.createservice = function(req,res){
    var service = Service.build({
        name: req.body.service_name,
        parent_id: req.body.parent_id
    });

    service.save().then(function(err) {
        if(err){
            console.log(err);
        }
        res.redirect('/admin');
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
        Service.findAll({ where: {parent_id: 0}}).then(function(services){
            console.log(JSON.stringify(services));
            res.render('index',{
                errors: errors,
                success_msg: req.flash('success_msg'),
                error_msg: req.flash('error_msg'),
                error: req.flash('error'),
                isAuthenticated: req.isAuthenticated(),
                services: services
            });
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
        });

        user.save().then(function(err) {
            if(err){
                console.log(err);
            }

            var message = {
                from: 'DoorStep Solutions <doorstepsolution.365days@gmail.com>',
                to: req.body.email,
                subject: 'Welcome o DoorStepSolutions',
                text: 'Hello '+req.body.first_name,
                html:'<p>Hello '+req.body.first_name+',<br>Welcome to DoorStepSolutions. Thank you Signup into DoorStepSolutions </p>'+
                '<p>Here is your Credentials: <br> Email:'+req.body.email+'<br> Password:'+req.body.password+'</p>'
            };

            Transport.sendMail(message, function(error){
                if(error){
                    console.log(error.message);
                }
                console.log('Message sent successfully!');
            });

            req.flash('success_msg','you are registerd and you can now login');
            res.redirect('/');
        });

    }
};


exports.serviceproviders = function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var mobile = req.body.mobileno;
    var DOB = req.body.DOB;
    var services_id = req.body.subservices;
    var address = req.body.address;
    var city = req.body.city;
    var gender = req.body.gender;

    var serviceprovider = ServiceProvider.build({
        name:name,
        email:email,
        mobile:mobile,
        DOB:DOB,
        city:city,
        gender:gender,
        address:address,
        services_id:services_id
    });

    serviceprovider.save().then(function(err) {
        if(err){
            console.log(err);
        }

        var message = {
            from: 'DoorStep Solutions <doorstepsolution.365days@gmail.com>',
            to: req.body.email,
            cc: 'DoorStep Solutions <doorstepsolution.365days@gmail.com>',
            subject: 'Welcome to DoorStepSolutions',
            text: 'Hello '+req.body.name,
            html:'<p>Hello '+req.body.name+',<br>Welcome to DoorStepSolutions. Thank you for Your Service Provider into DoorStepSolutions </p>'+
            '<p>Our team team will get back to you with in 5 hrs</p>'
        };

        Transport.sendMail(message, function(error){
            if(error){
                console.log(error.message);
            }
            console.log('Message sent successfully!');
        });

        req.flash('success_msg','you are registerd for Service Providers Thank you');
        res.redirect('/');
    });

};