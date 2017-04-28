const express = require('express');
const _ = require('lodash');
const multipart = require('connect-multiparty');
const fs = require('fs-extra');
const multipartMiddleware = multipart();
var path = require('path');

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
        var body = _.pick(req.body, ['name', 'price']);
        var book = Book.build(body);
        book.url = newfileURI;
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


});

module.exports = router;
