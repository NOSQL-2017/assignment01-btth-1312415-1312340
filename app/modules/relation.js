const User = require('../models/User');
const Book = require('../models/Book');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Order = require('../models/Order');


User.sync().then(function () {
    Book.belongsTo(User);
    User.hasMany(Book, {foreignKey: 'userId'});
    return Book.sync()
}).then(function () {
    Cart.belongsTo(User);
    User.hasMany(Cart, {foreignKey: 'userId'});
    return Cart.sync();
}).then(function () {
    CartItem.belongsTo(Cart);
    Cart.hasMany(CartItem,{foreignKey: 'cartId'});
    CartItem.belongsTo(Book);
    return CartItem.sync();
}).then(function () {
    Order.belongsTo(Cart);
    Cart.hasOne(Order);
    Order.sync();
});

module.exports = {
    User,
    Book,
    Cart,
    CartItem,
    Order
};








