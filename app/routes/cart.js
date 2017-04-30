const express = require('express');
const router = express.Router();
const Authentication = require('../modules/authentication');


router.get('/', Authentication, function (req, res) {
    var books = [];
    req.cart.getCartItems().then(function (cartItems) {
        var TotalPromise = cartItems.map(function (cartItem) {
            return (new Promise(function (resolve, reject) {
                cartItem.getBook().then(function (book) {
                    books.push(book);
                    resolve();
                }).catch(function (e) {
                    reject()
                })
            }));
        });
        Promise.all(TotalPromise).then(function () {
            res.render('cart', {
                page: 'cart',
                books: books
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