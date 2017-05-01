const express = require('express');
const _ = require('lodash');
const multipart = require('connect-multiparty');
const fs = require('fs');

const SaltAndHash = require('../modules/password');
const User = require('../models/User');
const cloudinary = require('../modules/cloudinary');

const multipartMiddleware = multipart();


const router = express.Router();

router.get('/login', function (req, res) {
   res.render('user/login',{
       page: 'login'
   })
});
router.post('/login',function (req, res) {
    var body = _.pick(req.body, ['email']);
    if (body) {
        User.findOne({ where: body }).then(function (user) {
            var Hash = SaltAndHash.hash(user.salt, req.body.password);
            if (user.hash === Hash) {
                req.session.user_id = user.id;
                if(req.session.last_url)
                {
                    res.redirect(req.session.last_url);
                }else{
                    res.redirect('/');
                }
            } else {
                req.flash('info', 'wrong email or password');
                res.redirect('/user/login');
            }
        }).catch(function (e) {
            req.flash('info', 'wrong email or password');
            res.redirect('/user/login');
        })
    }
});
router.get('/register', function (req, res) {
    res.render('user/register',{
        page: 'user'
    })
});
router.post('/logout',function (req, res) {
    req.session.user_id = null;
    res.redirect('/');
});
router.post('/register', multipartMiddleware, function (req, res) {
    if(!req.files.avatar.path){
        req.flash('info', 'Need an avatar');
        res.redirect('/user/register');
        return;
    }
    cloudinary.uploader.upload(req.files.avatar.path, function(result) {
        fs.unlinkSync(req.files.avatar.path);
        var salt = SaltAndHash.salt();
        var hash = SaltAndHash.hash(salt, req.body.password);
        var body = _.pick(req.body, ['name', 'email']);
        var user = User.build(body);
        if(result){
            user.avatar = result.url;
        }
        user.hash = hash;
        user.salt = salt;
        user.validate();
        user.save().then(function () {
            req.flash('info', 'New user added');
            req.session.user_id = user.id;
            res.redirect('/');
        }).catch(function (e) {
            console.log(e);

            res.redirect('/user/register');
        })
    });

});

module.exports = router;