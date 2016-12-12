var express = require('express');
var path = require('path');
var mysql = require('mysql');
var app = express();
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
var passport = require('passport');
var LocalStrategy = require('passport-local'),Strategy;
var expressValidator = require('express-validator');
var application = require('./routes/application');

var urlencodedParser = bodyParser.urlencoded({ extended: false })
var User = require('./models/user').User;
io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});
    

app.set('port', 3000);
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
        User.findOne({ where: {email: username} }).then(function(user) {
            passwd= user ? user.password :''
            isMatch = User.validPassword(password, passwd,done,user)
        });
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
app.post('/serviceproviders',routes.serviceproviders)
app.get('/subservices/:id?',routes.subservices)
app.post('/createservice',routes.createservice)
app.post('/signup', routes.signup)
app.get('/home_maintance',application.IsAuthenticated,routes.home_maintance)
app.get('/child_care',application.IsAuthenticated,routes.child_care)
app.get('/cooking',application.IsAuthenticated,routes.cooking)
app.get('/elder_care',application.IsAuthenticated,routes.elder_care)
app.get('/tutors',application.IsAuthenticated,routes.tutors)
app.get('/event_planner',application.IsAuthenticated,routes.event_planner)
app.get('/signout',application.destroySession)
app.get('/admin',routes.admin)
app.get('/chat', function (req, res) {
    res.render('chat')
});
/*
app.listen(process.env.PORT || 3000);
console.log('Express server listening on port ' + app.get('port'));*/
var port = process.env.PORT || 3000;
http.listen(port);
