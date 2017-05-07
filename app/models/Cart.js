const sequelize = require('../db/db');
const SQ = require('sequelize');
var User = require('./User');
var Book = require('./Book');
var Cart = sequelize.define('cart', {
    checked: {
        type: SQ.BOOLEAN,
        defaultValue: false
    }
});




module.exports = Cart;