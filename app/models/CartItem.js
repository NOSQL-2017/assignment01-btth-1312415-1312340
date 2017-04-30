var Book = require('./Book');
const sequelize = require('../modules/db');
const SQ = require('sequelize');
const Cart = require('./Cart');
var CartItem = sequelize.define('cartItem', {

});
CartItem.belongsTo(Cart);
Cart.hasMany(CartItem,{foreignKey: 'cartId'});
CartItem.belongsTo(Book);
CartItem.sync();
module.exports = CartItem;