const express = require('express');
const _ = require('lodash');
const Follow = require('../models/Follow');
const Book = require('../models/Book');
const User = require('../models/User');
const Authentication = require('../modules/authentication');

const router = express.Router();

function returnUser(array, callback) {
    var userArray = [];
    var totalPromises = array.map(function(userId) {
        return (new Promise(function (resolve, reject) {
            User.findById(userId).then(function (user) {
                userArray.push(user.name);
                resolve();
            }).catch(function (e) {
                reject()
            })
        }));
    });
    Promise.all(totalPromises).then(function () {
        callback(userArray);
    })
}
router.get('/', Authentication, function (req, res) {
    Follow.all({where: {userId: req.user.id}}, function (err, follows) {
        var array1 = [];
        var array2 = [];
        follows.forEach(function (follow) {
            array1.push(follow.followedUserId);
        });
        Follow.all({where: {followedUserId: req.user.id}}, function (err, follows) {
            follows.forEach(function (follow) {
                array2.push(follow.userId);
            });
            returnUser(array1, function (username1) {
                returnUser(array2, function (username2) {
                    res.render('follow', {
                        page: "follow",
                        follow: username1,
                        followedBy: username2
                    });
                });

            });

        })

    })
});
router.post('/:page/:id', Authentication, function (req, res) {
    if (req.user.id === parseInt(req.params.id)) {
        req.flash('info', 'can not follow yourself');
        res.redirect('/' + req.params.page + '/' + req.params.id);
        return;
    }
    Follow.all({where: {userId: req.user.id, followedUserId: parseInt(req.params.id)}}, function (err, follows) {
        if (follows.length > 0) {
            req.flash('info', 'already follow this user');
            res.redirect('/' + req.params.page + '/' + req.params.id);
            return;
        }
        var follow = new Follow({userId: req.user.id, followedUserId: parseInt(req.params.id)});

        follow.save(function (err) {
            if (err !== null) {
                return console.log(err);
            }
            req.flash('info', 'followed');
            res.redirect('/' + req.params.page + '/' + req.body.book);
        });
    });
});
module.exports = router;