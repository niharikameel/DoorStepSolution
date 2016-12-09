var passport = require('passport');
exports.IsAuthenticated=function(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        req.flash('error_msg','Please login to continue <a href="#" data-toggle="modal" data-target="#login-modal">CLICK HERE</a>');
        return res.redirect('/');
    }
}


exports.destroySession= function(req,res,next){
    req.logOut();
    req.session.destroy();

    res.redirect("/");
}