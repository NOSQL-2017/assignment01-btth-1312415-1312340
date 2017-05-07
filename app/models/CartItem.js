var Book = require('./Book');
const sequelize = require('../db/db');
const SQ = require('sequelize');
const Cart = require('./Cart');
var CartItem = sequelize.define('cartItem', {
    quantity:{
        type: SQ.INTEGER
    },
    status:{
        type: SQ.STRING,
        defaultValue: 'checked',
        validation:{
            isIn: ['checked', 'shipping', 'completed'],
        }
    }
});


module.exports = CartItem;