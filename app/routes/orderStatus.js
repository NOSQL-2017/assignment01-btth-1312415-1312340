const express = require('express');
const _ = require('lodash');
const User = require('../modules/relation').User;
const Cart = require('../modules/relation').Cart;
const Book = require('../modules/relation').Book;
const CartItem = require('../modules/relation').CartItem;
const Authentication = require('../modules/authentication');

const router = express.Router();
router.get('/', Authentication, function (req, res) {
    CartItem.findAll({
        include: [
            {
                model: Book,
                where: {
                    userId: req.user.id
                }
            },
            {
                model: Cart,
                where:{
                    checked: true
                },
                include: [
                    {
                        model: User
                    }
                ]
            }
        ],
    }).then(function (cartItems) {
        res.render('orderStatus', {
            page: 'orderStatus',
            cartItems: cartItems
        })
    })
});
router.post('/', Authentication, function (req, res) {
    CartItem.findById(req.body.id).then(function (cartItem) {
        cartItem.status = req.body.status;
        cartItem.save().then(function (cartItem) {
            req.flash('info','updated status');
            res.redirect('/orderStatus');
        })
    })
});

module.exports = router;
