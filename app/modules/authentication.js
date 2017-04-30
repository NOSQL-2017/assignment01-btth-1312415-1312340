const User = require('../models/User');
const Cart = require('../models/Cart');

var authentication = function (req, res, next) {
    var session = req.session.user_id;
    if(session){
        User.findById(req.session.user_id).then(function (user) {
            req.user = user;
            res.locals.session = user;
            user.getCarts({where: {checked: false}}).then(function (carts) {
                if(carts.length === 0){
                    Cart.create({}).then(function (cart) {
                        user.addCart(cart);
                        user.save();
                        req.cart = cart;
                        next();
                    });
                }else {
                    req.cart = carts[0];
                    next();
                }

            });

        }).catch(function (e) {
            res.send(e);
        })
    }
    else{
        req.flash('info', 'need to login');
        req.session.last_url = req.originalUrl;
        res.redirect('/user/login');
    }
};

module.exports = authentication;