const sequelize = require('../db/db');
const SQ = require('sequelize');
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
    description:{
        type: SQ.STRING,
        allowNull: {
            args: false,
            msg: 'Must have a description'
        },
        validate: {
            len: {
                args: [1],
                msg: 'Must have a description'
            }
        }
    },
    author: {
        type: SQ.STRING,
        allowNull: {
            args: false,
            msg: 'Must have a author'
        }
    },
    publisher: {
        type: SQ.STRING,
        allowNull: {
            args: false,
            msg: 'Must have a publisher'
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
        },
        validate: {
            len: {
                args: [1],
                msg: 'Must have a price'
            }
        }
    }
});


module.exports = Book;
