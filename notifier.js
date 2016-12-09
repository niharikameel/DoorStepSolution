var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport");
var transport = nodemailer.createTransport(smtpTransport({
    host : 'smtp.gmail.com',
    secureConnection : false,
    port: 587,
    auth : {
        user : "doorstepsolution.365days@gmail.com",
        pass : "doorstepsolution"
    }
}));
module.exports.transport = transport