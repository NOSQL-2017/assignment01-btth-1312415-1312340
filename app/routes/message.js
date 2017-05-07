const express = require('express');
const _ = require('lodash');
const Follow = require('../models/Follow');
const User = require('../modules/relation').User;
const Message = require('../models/Message');
const Authentication = require('../modules/authentication');

const router = express.Router();
router.get('/', Authentication, function (req, res) {
    Message.all({where: {recievedUserId: req.user.id}},function (err, messages) {
        Value = [];
        totalPromise = messages.map(function (message) {
            return(new Promise(function (resolve, reject) {
                User.findById(message.userId).then(function (user) {
                    Value.push({
                        title: message.title,
                        text: message.text,
                        name: user.name
                    })
                    resolve();

                })
            }))
        });
        Promise.all(totalPromise).then(function () {
            res.render('message/index', {
                page: "message",
                messages: Value
            })
        });

    });
});
router.get('/new', Authentication, function (req, res) {
    res.render('message/new', {
        page: "message"
    })
});
router.post('/new', Authentication, function (req, res) {

    User.findOne({where: {email: req.body.email}}).then(function (user) {
        if (!user) {
            req.flash('info', 'no user with that email');
            res.render('message/index', {
                page: "message"
            });
            return;
        }
        message = new Message({
            recievedUserId: user.id,
            userId: req.user.id,
            title: req.body.title,
            text: req.body.text
        });

        message.save(function (err) {
            req.flash('info', 'new message is created');
            res.redirect('/message');
        })


    });

});

module.exports = router;
