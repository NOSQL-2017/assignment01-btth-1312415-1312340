const sequelize = require('../modules/db');
const SQ = require('sequelize');
var User = require('./User');

var Book = sequelize.define('book', {
    name: {
        type: SQ.STRING,
        allowNull: {
            args: false,
            msg: 'Must have a name'
        },
        validate: {
            len: {
                args: [1],
                msg: 'Must have a name'
            }
        }
    },
    url: {
        type: SQ.STRING,
        allowNull: {
            args: false,
            msg: 'Must upload book'
        }
    },
    price: {
        type: SQ.DECIMAL(10, 2),
        allowNull: {
            args: false,
            msg: 'Must add a price'
        }
    }
});
Book.belongsTo(User);
 // Book.sync({force: true});
module.exports = Book;
