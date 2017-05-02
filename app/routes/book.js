const express = require('express');
const _ = require('lodash');
const multipart = require('connect-multiparty');
const fs = require('fs-extra');
const multipartMiddleware = multipart();
var path = require('path');
var EPub = require("epub");

const Category = require('../models/Category');
const CategoryMap = require('../models/CategoryMap');
const Book = require('../models/Book');
const Authentication = require('../modules/authentication');

const router = express.Router();

router.get('/', Authentication, function (req, res) {
    Book.findAll({where: {userId: req.user.id}}).then(function (books) {
        res.render('book/index', {
            page: "book",
            books: books
        });
    });
});
router.get('/upload', Authentication, function (req, res) {
    res.render('book/upload', {
        page: "book"
    });
});
router.post('/upload', Authentication, multipartMiddleware, function (req, res) {
    if (!req.files.book.path || path.extname(req.files.book.path) != '.epub') {
        req.flash('info', 'must upload book and have epub extension');
        res.redirect('/book/upload');
        return;
    }
    var newfileURI = "./public/epub/" + path.basename(req.files.book.path);
    fs.copy(req.files.book.path, newfileURI, function (err) {
        if (err) return console.error(err);
        fs.removeSync(req.files.book.path);
        var body = _.pick(req.body, ['price','description']);
        var book = Book.build(body);
        book.userId = req.user.id;
        book.url = newfileURI;
        var epub = new EPub(book.url, './images/IMG_ID/IMG_FILENAME', './chapters/CHAPTER_ID/CHAPTER_FILENAME');
        epub.on("end", function () {
            book.name = epub.metadata.title;
            book.publisher = epub.metadata.publisher;
            book.author = epub.metadata.creator;
            book.save().then(function () {
                var category = new CategoryMap({book: book.id});
                category.save();
                req.flash('info', 'New book added');
                res.redirect('/book');
            }).catch(function (e) {
                for (var i = 0; i < e.errors.length; i++) {
                    req.flash('info', e.errors[i].message);
                }

                res.redirect('/book/upload');
            })
        });
        epub.parse();

    });


});
router.get('/:id', Authentication, function (req, res) {
    Book.findById(req.params.id).then(function (book) {
        book.getUser().then(function (user) {
            Category.find({}).then(function (categories) {
                CategoryMap.findOne({book: req.params.id}).populate('category').then(function (categoryMap) {
                    if (user.id !== req.user.id) {
                        res.redirect('/book/');
                        return;
                    }
                    var URI = '.' + book.url.slice(8, book.url.length);
                    res.render('book/show', {
                        user: user,
                        page: "book",
                        book: book,
                        uri: URI,
                        check: (req.user.id === book.userId),
                        categories: categories,
                        bookCategories: categoryMap.category
                    });
                })

            })

        });


    }).catch(function (err) {
        req.flash('info', 'No book');
        res.redirect('/book');
    })
});
module.exports = router;
