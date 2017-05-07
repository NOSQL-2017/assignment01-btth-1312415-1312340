const express = require('express');
const _ = require('lodash');
const multipart = require('connect-multiparty');
const fs = require('fs-extra');
var path = require('path');

const CartItem = require('../modules/relation').CartItem;
const router = express.Router();
const Book = require('../modules/relation').Book;
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
    CartItem.findOne({where: {cartId: cart.id, bookId: req.params.id}}).then(function (cartItem) {
        if (cartItem) {
            cartItem.quantity += parseInt(req.body.quantity);
            cartItem.save();
            req.flash('info', 'Updated cart ');
            res.redirect(req.originalUrl);
            return;
        }
        Book.findById(req.params.id).then(function (book) {
           if(book.userId === req.user.id){
               req.flash('info', 'Can not buy your own book');
               res.redirect(req.originalUrl);
               return;
           }
            CartItem.create({bookId: req.params.id, quantity: req.body.quantity}).then(function (cartItem) {
                cart.addCartItem(cartItem);
                cart.save().then(function () {
                    req.flash('info', 'New book added to cart');
                    res.redirect(req.originalUrl);
                });
            })
        });

    })

});


module.exports = router;