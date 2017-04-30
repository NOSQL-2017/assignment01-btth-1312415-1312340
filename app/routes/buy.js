const express = require('express');
const _ = require('lodash');
const multipart = require('connect-multiparty');
const fs = require('fs-extra');
var path = require('path');

const CartItem = require('../models/CartItem');
const Cart = require('../models/Cart');
const router = express.Router();
const multipartMiddleware = multipart();
const Book = require('../models/Book');
const Authentication = require('../modules/authentication');

router.get('/', Authentication, function (req, res) {
    Book.findAll().then(function (books) {
        res.render('buy/index', {
            page: "buy",
            books: books
        });
    })
});
router.get('/:id', Authentication, function (req, res) {
    Book.findById(req.params.id).then(function (book) {
        var URI = '.' + book.url.slice(8, book.url.length);
        book.getUser().then(function (user) {
            res.render('buy/show', {
                page: "buy",
                book: book,
                user: user,
                uri: URI
            });
        })

    })
});
router.post('/:id', Authentication, function (req, res) {
    var cart = req.cart;
    var bookIds = [];
    Cart.findAll({where: {userId: req.user.id, checked: true}, include: [{model: CartItem}]}).then(function (carts) {
        carts.forEach(function (cart) {
            cart.cartItems.forEach(function (cartItem) {
                bookIds.push(cartItem.bookId)
            })
        });
        if (bookIds.includes(req.params.id)) {
            req.flash('info', 'you already bought this book');
            res.redirect(req.originalUrl);
            return;
        }
        CartItem.findOne({where: {cartId: cart.id, bookId: req.params.id}}).then(function (cartItem) {
            if (cartItem) {
                req.flash('info', 'Book is already in your cart');
                res.redirect(req.originalUrl);
                return;
            }
            CartItem.create({bookId: req.params.id}).then(function (cartItem) {
                cart.addCartItem(cartItem);
                cart.save().then(function () {
                    req.flash('info', 'New book added to cart');
                    res.redirect(req.originalUrl);
                });
            })
        })
    });

});


module.exports = router;