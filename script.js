var express = require('express');
var path = require('path');
var mysql = require('mysql');
var app = express();;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');


// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'jawahar',
    database : 'doorstepsolutions'
});

//connection.query('USE test_database')

app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static('public'));
app.use(cookieParser());
app.use(session({secret: "Your secret key"}));
//app.use(express.cookieSession());
connection.connect(function(error) {
    if(!!error){
        console.log("not connected");
    }
    else
    {
        console.log("connected");
    }
});

app.get('/', function(req, res){

    res.sendFile(app.get('views') + "/" + "index.html" );
//res.render(app.get('views') + "/" + "index.ejs");
});


app.post('/signup', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    var response = {
        name:req.body.name,
        email:req.body.email,
        DOB:req.body.DOB,
        city:req.body.city,
        gender:req.body.gender
    };

    var register=connection.query('INSERT INTO registration SET ?', response, function(err,res){
        if(!!err){
            console.log("error again");
            throw err;
        }
        else
        {
            console.log("row created success");

        }

        console.log('Last insert ID:', res.insertId);

    });
    if(register)
    {
        res.send('registered successful');
    }
    else
    {
        res.send('registered unsuccessful');
    }
})

app.listen(app.get('port'));
console.log('Express server listening on port ' + app.get('port'));