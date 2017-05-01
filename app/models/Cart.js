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
Cart.belongsTo(User);
User.hasMany(Cart, {foreignKey: 'userId'});
Cart.sync();
module.exports = Cart;