const express = require('express');
const _ = require('lodash');
const User = require('../modules/relation').User;
const Cart = require('../modules/relation').Cart;
const Book = require('../modules/relation').Book;
const CartItem = require('../modules/relation').CartItem;
const Authentication = require('../modules/authentication');

const router = express.Router();
router.get('/', Authentication, function (req, res) {
    Cart.findAll({
        include: [{
            model: CartItem,
            include: [{
                model: Book
            }]
        }],
        where: {
            userId: req.user.id,
            checked: true
        }
    }).then(function (carts) {
        res.render('order',{
            page: 'order',
            carts: carts
        })
    })
});

module.exports = router;
