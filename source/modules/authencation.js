const User = require('../models/User');

var serialize = function (req, res, next) {
    var session = req.session.user_id;
    if(session){
        User.findById(req.session.user_id).then(function (user) {
            req.user = user;
            res.locals.session = user;
            next();
        }).catch(function (e) {
            res.send(e);
        })
    }
    else{
        req.flash('info', 'need to login');
        res.redirect('/user/login');
    }
};

module.exports = serialize;