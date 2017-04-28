var User = require('./User');
var Book = require('./Book');
const sequelize = require('../modules/db');
const SQ = require('sequelize');

var BookSold = sequelize.define('booksold', {

});
BookSold.belongsTo(Book);
BookSold.belongsTo(User);
BookSold.sync({force: true});
module.exports = BookSold;