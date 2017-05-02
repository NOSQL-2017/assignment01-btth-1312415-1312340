const express = require('express');
const router = express.Router();
const Authentication = require('../modules/authentication');


router.get('/', Authentication, function (req, res) {
    var items = [];
    req.cart.getCartItems().then(function (cartItems) {
        var TotalPromise = cartItems.map(function (cartItem) {
            return (new Promise(function (resolve, reject) {
                cartItem.getBook().then(function (book) {
                    var item = {
                        quantity: cartItem.quantity,
                        name: book.name,
                        price: book.price,
                        description: book.description
                    };
                    items.push(item);
                    resolve();
                }).catch(function (e) {
                    reject()
                })
            }));
        });
        Promise.all(TotalPromise).then(function () {
            res.render('cart', {
                page: 'cart',
                books: items
            });
        }).catch(function (e) {
            console.log(e);
        });
    });

});
router.post('/', Authentication, function (req, res) {
   req.cart.checked = true;
   req.cart.save().then(function () {
       req.flash('info', 'Checked');
       res.redirect(req.originalUrl);
   })
});


module.exports = router;