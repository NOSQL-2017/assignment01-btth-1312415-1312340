const User = require('../modules/relation').User;
const Cart = require('../modules/relation').Cart;

var authentication = function (req, res, next) {
    var session = req.session.key;
    console.log(req.session.key);
    if(session){
        User.findById(req.session.key).then(function (user) {
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
        res.redirect('/user/login');
    }
};

module.exports = authentication;