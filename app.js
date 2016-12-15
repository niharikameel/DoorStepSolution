var express = require('express');
var path = require('path');
var mysql = require('mysql');
var app	= express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var routes = require('./routes');
var bcrypt = require('bcryptjs');
//var bcrypt = require('bcrypt');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local'),Strategy;
var expressValidator = require('express-validator');
var application = require('./routes/application');
/*var io = require('socket.io')(express);*/
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var User = require('./models/user').User;
io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});
//app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser());
app.use('/img',express.static(path.join(__dirname, 'public/images')));
app.use('/js',express.static(path.join(__dirname, 'public/javascripts')));
app.use('/css',express.static(path.join(__dirname, 'public/stylesheets')));
app.use(session({
    secret:'secret',
    resave: false,
    saveUninitialized: false
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

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        if(username=="admin@doorstepsolution.com"&&password=="1234"){
            done(null,"Admin");
        }else{
            User.findOne({ where: {email: username} }).then(function(user) {
                passwd= user ? user.password :''
                isMatch = User.validPassword(password, passwd,done,user)
            });
        }

    }
));

app.get('/',routes.home);
app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true
    })
);
app.get('/admin/serviceprovider/show/:id?',routes.serviceprovider_show)
app.get('/admin/all_serviceproviders',application.IsAuthenticated,routes.all_serviceproviders)
app.post('/contacting',routes.contacting)
app.get('/admin/serviceproviderstemplate',application.IsAuthenticated,routes.serviceproviderstemplate)
app.post('/serviceprovidermail',routes.serviceprovidermail)
app.post('/serviceprovider/edit/',routes.serviceproviderchange)

app.get('/child_care',application.IsAuthenticated,routes.child_care)
app.get('/child_care/pediatrics',application.IsAuthenticated,routes.pediatrics)
app.get('/child_care/academic_tutor',application.IsAuthenticated,routes.academic_tutor)
app.get('/child_care/care_taker',application.IsAuthenticated,routes.care_taker)
app.get('/child_care/child_development',application.IsAuthenticated,routes.child_development)
app.get('/child_care/child_transport',application.IsAuthenticated,routes.child_transport)

app.get('/admin/serviceprovider/:id?',routes.serviceprovider)
app.get('/admin/serviceprovider/edit/:id?',routes.servicerpovider_edit)
app.post('/serviceproviders',routes.serviceproviders)
app.get('/subservices/:id?',routes.subservices)
app.post('/createservice',routes.createservice)
app.post('/signup', routes.signup)

app.get('/home_maintance',application.IsAuthenticated,routes.home_maintance)
app.get('/painting',application.IsAuthenticated,routes.painting)
app.get('/house_cleaning',application.IsAuthenticated,routes.house_cleaning)
app.get('/carpentary',application.IsAuthenticated,routes.carpentary)
app.get('/plumbing',application.IsAuthenticated,routes.plumbing)
app.get('/electrical_work',application.IsAuthenticated,routes.electrical_work)
app.get('/gardening',application.IsAuthenticated,routes.gardening)



app.get('/cooking',application.IsAuthenticated,routes.cooking)
app.get('/indian_food',application.IsAuthenticated,routes.indian_food)
app.get('/italian_food',application.IsAuthenticated,routes.italian_food)
app.get('/chinese_food',application.IsAuthenticated,routes.chinese_food)
app.get('/traditional_food',application.IsAuthenticated,routes.traditional_food)



app.get('/elder_care',application.IsAuthenticated,routes.elder_care)
app.get('/elder_care/medical_care',application.IsAuthenticated,routes.medical_care)
app.get('/elder_care/elder_transport',application.IsAuthenticated,routes.elder_transport)
app.get('/elder_care/elder_caretaker',application.IsAuthenticated,routes.elder_caretaker)
app.get('/elder_care/nursing',application.IsAuthenticated,routes.nursing)


app.get('/event_planner',application.IsAuthenticated,routes.event_planner)
app.get('/marriage_planning',application.IsAuthenticated,routes.marriage_planning)
app.get('/birthday_party',application.IsAuthenticated,routes.birthday_party)
app.get('/anniversary_party',application.IsAuthenticated,routes.anniversary_party)
app.get('/festival',application.IsAuthenticated,routes.festival)
app.get('/weekend_party',application.IsAuthenticated,routes.weekend_party)



app.get('/tutors',application.IsAuthenticated,routes.tutors)
app.get('/software_programming',application.IsAuthenticated,routes.software_programming)
app.get('/networking',application.IsAuthenticated,routes.networking)
app.get('/languages',application.IsAuthenticated,routes.languages)
app.get('/craft_work',application.IsAuthenticated,routes.craft_work)
app.get('/music',application.IsAuthenticated,routes.music)
app.get('/painting',application.IsAuthenticated,routes.painting)




app.get('/signout',application.destroySession)
app.get('/admin',application.IsAuthenticated,routes.admin)
app.get('/chat', function (req, res) {
    res.render('chat')
});


/*
 app.listen(process.env.PORT || 3000);
 console.log('Express server listening on port ' + app.get('port'));*/
var port = process.env.PORT || 3000;
http.listen(port);