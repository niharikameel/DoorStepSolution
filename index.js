var bcrypt = require('bcryptjs');
//var bcrypt = require('bcrypt');
var crypto = require('crypto');
var User = require('../models/user').User;
var Transport = require('../models/notifier').transport;
var Service = require('../models/services').Service;
var ServiceProvider = require('../models/services').ServiceProvider;
exports.home = function(req, res) {

    Service.findAll({ where: {parent_id: 0}}).then(function(services){
        res.render('index',{
            errors: '',
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg'),
            error: req.flash('error'),
            isAuthenticated: req.isAuthenticated(),
            services: services,
            username: req.user
        });
    });

};
exports.ftpwd = function(req,res){
    var email = req.body.email;

    User.findOne({where:{email: email}}).then(function(user){
        if(user){
            var pwd = crypto.randomBytes(6).toString('hex');
            user.update({password: pwd}).then(function() {
            })

            var message = {
                from: 'DoorStep Solutions <doorstepsolution.365days@gmail.com>',
                to: email,
                subject: 'Recovery Password',
                html:'<p>Email:'+req.body.email+'</p>'+
                '<p>Password:'+ pwd+'</p>'
            };

            Transport.sendMail(message, function(error){
                if(error){
                    console.log(error.message);
                }
                console.log('Message sent successfully!');
            });
            req.flash('success_msg','Check your email for password');
            res.redirect('/');
        } else {
            req.flash('error_msg',"Wrong Email Id");
            res.redirect('/');
        }
    })
}
exports.forgotpassword = function(req,res){

    res.render('ftpage',{
        title: "Forgot Password"
    });
}
exports.myprofile = function(req,res){
    res.render('myprofile',{
        userdetails: req.user
    });
}
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
                services: null
            });
        }
    });
};
exports.servicerpovider_edit = function(req,res){
    var id=req.params.id
    ServiceProvider.findOne({where: {id: id}}).then(function(sp){
        res.render('edit',{sp:sp});
    })
}

exports.serviceproviderchange = function(req,res){
    var name=req.body.name;
    var email=req.body.email;
    var mobile=req.body.mobileno;
    var city=req.body.city;
    var address=req.body.address;
    var id=req.body.id
    ServiceProvider.findOne({where: {id: id}}).then(function(sp){
        sp.update({name: name,email:email,mobile:mobile,city:city,address:address}).then(function() {
            res.redirect('/admin/all_serviceproviders');
        })

    })

}
exports.serviceprovider= function(req,res){
    var id=req.params.id
    ServiceProvider.destroy({where: {id: id }}).then(function(){
        res.redirect('/admin/all_serviceproviders');
    })

}
exports.subservices = function(req,res){
    var id=req.params.id;
    Service.findAll({ where: {parent_id: id}}).then(function(services){
        res.send(services);
    });
};
exports.serviceprovider_show = function(req,res){
    var id=req.params.id;
    ServiceProvider.findOne({ where: {id: id},include: [{ model: Service, as:'Service', attributes:['name'] }]}).then(function(sp){
        res.render('sp_show',{sp:sp});
    });
}
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

exports.child_care = function(req, res) {
    res.render('Childcare',{
        title: 'ChildCare Service'
    });
};


exports.pediatrics= function(req,res){
    Service.findOne({ where: {name: 'pediatrics'}}).then(function(services){
        if(services){
            ServiceProvider.findAll({ where: {services_id: services.id}}).then(function(serviceproviders){
                res.render('profile',{
                    title: 'Pediatrics Service',
                    serviceproviders: serviceproviders
                });
            });
        }else{
            res.render('profile',{
                title: 'Pediatrics Service',
                serviceproviders: null
            });
        }
    });
}





exports.academic_tutor= function(req,res){
    Service.findOne({ where: {name: 'academic tutor'}}).then(function(services){
        if(services){
            ServiceProvider.findAll({ where: {services_id: services.id}}).then(function(serviceproviders){
                res.render('profile',{
                    title: 'Academic Tutor Service',
                    serviceproviders: serviceproviders
                });
            });
        }else{
            res.render('profile',{
                title: 'Academic Tutor Service',
                serviceproviders: null
            });
        }



    });
}

exports.care_taker= function(req,res){
    Service.findOne({ where: {name: 'care taker'}}).then(function(services){
        if(services){
            ServiceProvider.findAll({ where: {services_id: services.id}}).then(function(serviceproviders){
                res.render('profile',{
                    title: 'Care Taker Service',
                    serviceproviders: serviceproviders
                });
            });
        }else{
            res.render('profile',{
                title: 'Care Taker Service',
                serviceproviders: null
            });
        }

    });
}

exports.child_development= function(req,res){
    Service.findOne({ where: {name: 'child development'}}).then(function(services){
        if(services){
            ServiceProvider.findAll({ where: {services_id: services.id}}).then(function(serviceproviders){
                res.render('profile',{
                    title: 'Child Development Service',
                    serviceproviders: serviceproviders
                });
            });
        }else{
            res.render('profile',{
                title: 'Child Development Service',
                serviceproviders: null
            });
        }

    });
}

exports.child_transport= function(req,res){
    Service.findOne({ where: {name: 'child transport'}}).then(function(services){
        if(services){
            ServiceProvider.findAll({ where: {services_id: services.id}}).then(function(serviceproviders){
                res.render('profile',{
                    title: 'Child Transport Service',
                    serviceproviders: serviceproviders
                });
            });
        }else{
            res.render('profile',{
                title: 'Child Transport Service',
                serviceproviders: null
            });
        }
    });
}

exports.elder_care = function(req, res) {
    res.render('ElderCare',{
        title: 'ElderCare Service'
    });
};


exports.medical_care= function(req,res){
    Service.findOne({ where: {name: 'medical care'}}).then(function(services){
        if(services){
            ServiceProvider.findAll({ where: {services_id: services.id}}).then(function(serviceproviders){
                res.render('profile',{
                    title: 'Medical Care Service',
                    serviceproviders: serviceproviders
                });
            });
        }else{
            res.render('profile',{
                title: 'Medical Care Service',
                serviceproviders: null
            });
        }
    });
}


exports.elder_transport= function(req,res){
    Service.findOne({ where: {name: 'transport'}}).then(function(services){
        if(services){
            ServiceProvider.findAll({ where: {services_id: services.id}}).then(function(serviceproviders){
                res.render('profile',{
                    title: 'Elder Transport Service',
                    serviceproviders: serviceproviders
                });
            });
        }else{
            res.render('profile',{
                title: 'Elder Transport Service',
                serviceproviders: null
            });
        }
    });
}

exports.nursing= function(req,res){
    Service.findOne({ where: {name: 'nursing'}}).then(function(services){
        if(services){
            ServiceProvider.findAll({ where: {services_id: services.id}}).then(function(serviceproviders){
                res.render('profile',{
                    title: 'Nursing Service',
                    serviceproviders: serviceproviders
                });
            });
        }else{
            res.render('profile',{
                title: 'Nursing Service',
                serviceproviders: null
            });
        }
    });
}


exports.elder_caretaker= function(req,res){
    Service.findOne({ where: {name: 'care taker'}}).then(function(services){
        if(services){
            ServiceProvider.findAll({ where: {services_id: services.id}}).then(function(serviceproviders){
                res.render('profile',{
                    title: 'Elder CareTaker Service',
                    serviceproviders: serviceproviders
                });
            });
        }else{
            res.render('profile',{
                title: 'Elder CareTaker Service',
                serviceproviders: null
            });
        }
    });
}

exports.home_maintance = function(req, res) {
    res.render('HomeMaintance',{
        title: 'Home Maintance Service'
    });
};

exports.painting= function(req,res) {
    Service.findOne({where: {name: 'painting'}}).then(function (services) {
        if (services) {
            ServiceProvider.findAll({where: {services_id: services.id}}).then(function (serviceproviders) {
                res.render('profile', {
                    title: 'Painting Service',
                    serviceproviders: serviceproviders
                });
            });
        } else {
            res.render('profile', {
                title: 'Painting Service',
                serviceproviders: null
            });
        }

    });
}



exports.house_cleaning= function(req,res) {
    Service.findOne({where: {name: 'house cleaning'}}).then(function (services) {
        if (services) {
            ServiceProvider.findAll({where: {services_id: services.id}}).then(function (serviceproviders) {
                res.render('profile', {
                    title: 'House Cleaning Service',
                    serviceproviders: serviceproviders
                });
            });
        } else {
            res.render('profile', {
                title: 'House Cleaning Service',
                serviceproviders: null
            });
        }

    });
}



exports.carpentary= function(req,res) {
    Service.findOne({where: {name: 'carpentary'}}).then(function (services) {
        if (services) {
            ServiceProvider.findAll({where: {services_id: services.id}}).then(function (serviceproviders) {
                res.render('profile', {
                    title: 'Carpentary Service',
                    serviceproviders: serviceproviders
                });
            });
        } else {
            res.render('profile', {
                title: 'Carpentary Service',
                serviceproviders: null
            });
        }

    });
}



exports.plumbing= function(req,res) {
    Service.findOne({where: {name: 'plumbing'}}).then(function (services) {
        if (services) {
            ServiceProvider.findAll({where: {services_id: services.id}}).then(function (serviceproviders) {
                res.render('profile', {
                    title: 'Plumbing Service',
                    serviceproviders: serviceproviders
                });
            });
        } else {
            res.render('profile', {
                title: 'Plumbing Service',
                serviceproviders: null
            });
        }

    });
}


exports.electrical_work= function(req,res) {
    Service.findOne({where: {name: 'electrical work'}}).then(function (services) {
        if (services) {
            ServiceProvider.findAll({where: {services_id: services.id}}).then(function (serviceproviders) {
                res.render('profile', {
                    title: 'Electrical Work Service',
                    serviceproviders: serviceproviders
                });
            });
        } else {
            res.render('profile', {
                title: 'Electrical Work Service',
                serviceproviders: null
            });
        }

    });
}



exports.gardening= function(req,res) {
    Service.findOne({where: {name: 'gardening'}}).then(function (services) {
        if (services) {
            ServiceProvider.findAll({where: {services_id: services.id}}).then(function (serviceproviders) {
                res.render('profile', {
                    title: 'Gardening Service',
                    serviceproviders: serviceproviders
                });
            });
        } else {
            res.render('profile', {
                title: 'Gardening Service',
                serviceproviders: null
            });
        }

    });
}


exports.cooking = function(req, res) {
    res.render('Cooking',{
        title: 'Cooking Service'
    });
};


exports.indian_food= function(req,res) {
    Service.findOne({where: {name: 'indian food'}}).then(function (services) {
        if (services) {
            ServiceProvider.findAll({where: {services_id: services.id}}).then(function (serviceproviders) {
                res.render('profile', {
                    title: 'Indian Food Service',
                    serviceproviders: serviceproviders
                });
            });
        } else {
            res.render('profile', {
                title: 'Indian Food Service',
                serviceproviders: null
            });
        }

    });
}


exports.italian_food= function(req,res) {
    Service.findOne({where: {name: 'italian food'}}).then(function (services) {
        if (services) {
            ServiceProvider.findAll({where: {services_id: services.id}}).then(function (serviceproviders) {
                res.render('profile', {
                    title: 'Italian Food Service',
                    serviceproviders: serviceproviders
                });
            });
        } else {
            res.render('profile', {
                title: 'Italian Food Service',
                serviceproviders: null
            });
        }

    });
}



exports.chinese_food= function(req,res) {
    Service.findOne({where: {name: 'chinese food'}}).then(function (services) {
        if (services) {
            ServiceProvider.findAll({where: {services_id: services.id}}).then(function (serviceproviders) {
                res.render('profile', {
                    title: 'Chinese Food Service',
                    serviceproviders: serviceproviders
                });
            });
        } else {
            res.render('profile', {
                title: 'Chinese Food Service',
                serviceproviders: null
            });
        }

    });
}


exports.traditional_food= function(req,res) {
    Service.findOne({where: {name: 'traditional food'}}).then(function (services) {
        if (services) {
            ServiceProvider.findAll({where: {services_id: services.id}}).then(function (serviceproviders) {
                res.render('profile', {
                    title: 'Traditional Food Service',
                    serviceproviders: serviceproviders
                });
            });
        } else {
            res.render('profile', {
                title: 'Traditional Food Service',
                serviceproviders: null
            });
        }

    });
}




exports.event_planner = function(req, res) {
    res.render('EventManagemant',{
        title: 'Event Planner Services'
    });
};



exports.marriage_planning= function(req,res) {
    Service.findOne({where: {name: 'marriage planning'}}).then(function (services) {
        if (services) {
            ServiceProvider.findAll({where: {services_id: services.id}}).then(function (serviceproviders) {
                res.render('profile', {
                    title: 'Marriage Planning Service',
                    serviceproviders: serviceproviders
                });
            });
        } else {
            res.render('profile', {
                title: 'Marriage Planning Service',
                serviceproviders: null
            });
        }

    });
}


exports.birthday_party= function(req,res) {
    Service.findOne({where: {name: 'birthday party'}}).then(function (services) {
        if (services) {
            ServiceProvider.findAll({where: {services_id: services.id}}).then(function (serviceproviders) {
                res.render('profile', {
                    title: 'Birthday Party Service',
                    serviceproviders: serviceproviders
                });
            });
        } else {
            res.render('profile', {
                title: 'Birthday Party Service',
                serviceproviders: null
            });
        }

    });
}




exports.anniversary_party= function(req,res) {
    Service.findOne({where: {name: 'anniversary party'}}).then(function (services) {
        if (services) {
            ServiceProvider.findAll({where: {services_id: services.id}}).then(function (serviceproviders) {
                res.render('profile', {
                    title: 'Anniversary Party Service',
                    serviceproviders: serviceproviders
                });
            });
        } else {
            res.render('profile', {
                title: 'Anniversary Party Service',
                serviceproviders: null
            });
        }

    });
}


exports.anniversary_party= function(req,res) {
    Service.findOne({where: {name: 'anniversary party'}}).then(function (services) {
        if (services) {
            ServiceProvider.findAll({where: {services_id: services.id}}).then(function (serviceproviders) {
                res.render('profile', {
                    title: 'Anniversary Party Service',
                    serviceproviders: serviceproviders
                });
            });
        } else {
            res.render('profile', {
                title: 'Anniversary Party Service',
                serviceproviders: null
            });
        }

    });
}


exports.festival= function(req,res) {
    Service.findOne({where: {name: 'festival'}}).then(function (services) {
        if (services) {
            ServiceProvider.findAll({where: {services_id: services.id}}).then(function (serviceproviders) {
                res.render('profile', {
                    title: 'Festival Service',
                    serviceproviders: serviceproviders
                });
            });
        } else {
            res.render('profile', {
                title: 'Festival Service',
                serviceproviders: null
            });
        }

    });
}


exports.weekend_party= function(req,res) {
    Service.findOne({where: {name: 'weekend party'}}).then(function (services) {
        if (services) {
            ServiceProvider.findAll({where: {services_id: services.id}}).then(function (serviceproviders) {
                res.render('profile', {
                    title: 'Weekend Party Service',
                    serviceproviders: serviceproviders
                });
            });
        } else {
            res.render('profile', {
                title: 'Weekend Party Service',
                serviceproviders: null
            });
        }

    });
}





exports.tutors = function(req, res) {
    res.render('TutorService',{
        title: 'Tutor Services'
    });
};


exports.software_programming= function(req,res) {
    Service.findOne({where: {name: 'software programming'}}).then(function (services) {
        if (services) {
            ServiceProvider.findAll({where: {services_id: services.id}}).then(function (serviceproviders) {
                res.render('profile', {
                    title: 'Software Programming Service',
                    serviceproviders: serviceproviders
                });
            });
        } else {
            res.render('profile', {
                title: 'Software Programming Service',
                serviceproviders: null
            });
        }

    });
}


exports.networking= function(req,res) {
    Service.findOne({where: {name: 'networking'}}).then(function (services) {
        if (services) {
            ServiceProvider.findAll({where: {services_id: services.id}}).then(function (serviceproviders) {
                res.render('profile', {
                    title: 'Networking Service',
                    serviceproviders: serviceproviders
                });
            });
        } else {
            res.render('profile', {
                title: 'Networking Service',
                serviceproviders: null
            });
        }

    });
}


exports.languages= function(req,res) {
    Service.findOne({where: {name: 'languages'}}).then(function (services) {
        if (services) {
            ServiceProvider.findAll({where: {services_id: services.id}}).then(function (serviceproviders) {
                res.render('profile', {
                    title: 'Languages Service',
                    serviceproviders: serviceproviders
                });
            });
        } else {
            res.render('profile', {
                title: 'Languages Service',
                serviceproviders: null
            });
        }

    });
}



exports.craft_work= function(req,res) {
    Service.findOne({where: {name: 'craft work'}}).then(function (services) {
        if (services) {
            ServiceProvider.findAll({where: {services_id: services.id}}).then(function (serviceproviders) {
                res.render('profile', {
                    title: 'Craft Work Service',
                    serviceproviders: serviceproviders
                });
            });
        } else {
            res.render('profile', {
                title: 'Craft Work Service',
                serviceproviders: null
            });
        }

    });
}

exports.music= function(req,res) {
    Service.findOne({where: {name: 'music'}}).then(function (services) {
        if (services) {
            ServiceProvider.findAll({where: {services_id: services.id}}).then(function (serviceproviders) {
                res.render('profile', {
                    title: 'Music Service',
                    serviceproviders: serviceproviders
                });
            });
        } else {
            res.render('profile', {
                title: 'Music Service',
                serviceproviders: null
            });
        }

    });
}


exports.painting= function(req,res) {
    Service.findOne({where: {name: 'painting'}}).then(function (services) {
        if (services) {
            ServiceProvider.findAll({where: {services_id: services.id}}).then(function (serviceproviders) {
                res.render('profile', {
                    title: 'Painting Service',
                    serviceproviders: serviceproviders
                });
            });
        } else {
            res.render('profile', {
                title: 'Painting Service',
                serviceproviders: null
            });
        }

    });
}

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
                services: services,
                username: req.user.firstname
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
                subject: 'Welcome to DoorStepSolutions',
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

exports.serviceproviderstemplate = function(req,res){
    Service.findAll({ where: {parent_id: 0}}).then(function(services){
        console.log(JSON.stringify(services));
        res.render('serviceprovider',{
            services: services
        });
    });
}
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
            subject: 'Regarding Your Services',
            html:'<p>Hello '+req.body.name+',<br>Welcome to DoorStepSolutions. Thank you for Your Service Provider into DoorStepSolutions  You are one of my service provider</p>'
        };

        Transport.sendMail(message, function(error){
            if(error){
                console.log(error.message);
            }
            console.log('Message sent successfully!');
        });

        req.flash('success_msg','you are registerd for Service Providers Thank you');
        res.redirect('/admin/all_serviceproviders');
    });

};


exports.serviceprovidermail= function(req,res){

    var name = req.body.name;
    var email = req.body.email;
    var mobile = req.body.mobileno;
    var DOB = req.body.DOB;
    var services_id = req.body.subservices;
    var address = req.body.address;
    var city = req.body.city;
    var gender = req.body.gender;
    Service.findOne({ where: {id: services_id}}).then(function(sp){
        var message = {
            from: 'DoorStep Solutions <doorstepsolution.365days@gmail.com>',
            to: req.body.email,
            cc: 'DoorStep Solutions <doorstepsolution.365days@gmail.com>',
            subject: 'Request for ServiecProvider Registration',
            html:'<p>Hello '+req.body.name+',<br>Welcome to DoorStepSolutions. Thank you for Your Service Provider into DoorStepSolutions </p>'+
            '<p>Our team team will get back to you with in 5 hrs</p><br>Here is your details: name:'+name+'<br> Email:'+email+'<br> Mobile:'+mobile+'<br>DOB:'+DOB+'<br> Your Services:'+sp.name+'<br> city:'+city+'<br> gender:'+gender+'<br> Address:'+address+'.'
        };

        Transport.sendMail(message, function(error){
            if(error){
                console.log(error.message);
            }
            console.log('Message sent successfully!');
        });
    });

    req.flash('success_msg','you are registerd for Service Providers Thank you');
    res.redirect('/');

}

exports.all_serviceproviders=function(req,res){
    ServiceProvider.findAll({include: [{ model: Service, as:'Service', attributes:['name'] }]}).then(function(serviceproviders){
        res.render('listserviceprovider',{
            serviceproviders: serviceproviders
        });
    });
}
exports.contacting=function(req,res){
    var name = req.body.name;
    var email = req.body.email;
    var comment = req.body.comment;


    var message = {
        from: 'DoorStep Solutions <doorstepsolution.365days@gmail.com>',
        to: req.body.email,
        cc: 'DoorStep Solutions <doorstepsolution.365days@gmail.com>',
        subject: 'Contacting',
        html:'<p>Hello '+req.body.name+',<br>Welcome to DoorStepSolutions. Thank you for Your Service Provider into DoorStepSolutions </p>'+
        '<p>We will see your comment we will contact you</p>'
    };

    Transport.sendMail(message, function(error){
        if(error){
            console.log(error.message);
        }
        console.log('Message sent successfully!');
    });

    var message = {
        from: 'DoorStep Solutions <doorstepsolution.365days@gmail.com>',
        to: 'DoorStep Solutions <doorstepsolution.365days@gmail.com>',
        subject: 'reacting to Contact',
        html:'<p>Name: '+req.body.name+',<br>Email:'+req.body.email+'</p>'+
        '<p>Comment:'+req.body.comment+'</p>'
    };

    Transport.sendMail(message, function(error){
        if(error){
            console.log(error.message);
        }
        console.log('Message sent successfully!');
    });
    req.flash('success_msg','You contact is registered we wil get back to you');
    res.redirect('/');


}