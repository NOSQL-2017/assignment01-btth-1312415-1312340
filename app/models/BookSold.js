var User = require('./User');
var Book = require('./Book');
const sequelize = require('../modules/db');
const SQ = require('sequelize');

var BookOwner = sequelize.define('bookowner', {

});
BookOwner.belongsTo(Book);
BookOwner.belongsTo(User);
BookOwner.sync({force: true});
module.exports = BookOwner;