const express = require('express');
const _ = require('lodash');
const multipart = require('connect-multiparty');
const fs = require('fs-extra');
const multipartMiddleware = multipart();
var path = require('path');
var EPub = require("epub");

const cloudinary = require('../modules/cloudinary');
const Book = require('../models/Book');
const Authentication = require('../modules/authentication');

const router = express.Router();

router.get('/', Authentication, function (req, res) {
    Book.findAll().then(function (books) {
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
        var body = _.pick(req.body, [ 'price']);

        var book = Book.build(body);
        book.userId = req.user.id;
        book.url = newfileURI;
        var epub = new EPub(book.url,'./images/IMG_ID/IMG_FILENAME', './chapters/CHAPTER_ID/CHAPTER_FILENAME');
        epub.on("end", function(){
            book.name = epub.metadata.title;
            book.save().then(function () {
                req.flash('info', 'New book added');
                res.redirect('/book');
            }).catch(function (e) {
                for (var i = 0; i < e.errors.length; i++) {
                    req.flash('info', e.errors[i].message);
                }

                res.redirect('/user/register');
            })
        });
        epub.parse();

    });


});
router.get('/:id',Authentication,function (req, res) {
    Book.findById(req.params.id).then(function (book) {
        console.log(book.user);
        var epub = new EPub(book.url);
        epub.on("end", function(){
            var URI = '.' + book.url.slice(8, book.url.length);
            res.render('book/show', {
                page: "book",
                book: book,
                uri: URI,
                epub: epub
            });
        });
        epub.parse();
    }).catch(function (err) {
        req.flash('info', 'No book');
        res.redirect('/book');
    })
});
module.exports = router;
