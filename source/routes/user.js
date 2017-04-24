const express = require('express');
const SaltAndHash = require('../modules/password');
const User = require('../models/User');
const _ = require('lodash');
const cloudinary = require('cloudinary');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

cloudinary.config({
    cloud_name: 'du27rtoxp',
    api_key: '961163633288279',
    api_secret: 'E40LT_jwdgycmLksE37Gql21E5M'
});

const router = express.Router();

router.get('/login', function (req, res) {
   res.render('user/login',{
       page: 'login'
   })
});
router.post('/login',function (req, res) {
    var body = _.pick(req.body, ['email']);
    if (body) {
        User.find(body).then(function (user) {
            var Hash = SaltAndHash.hash(user.salt, req.body.password);
            if (user.hash === Hash) {
                req.session.user_id = user.id;
                res.redirect('/');
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
        page: 'user',
    })
});
router.post('/logout',function (req, res) {
    req.session.user_id = null;
    res.redirect('/');
});
router.post('/register', multipartMiddleware, function (req, res) {
    cloudinary.uploader.upload(req.files.avatar.path, function(result) {
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
        if(!req.body.password){
            req.flash('info', 'need a password');
            res.redirect('/user/register');
            return;
        }
        user.save().then(function () {
            req.flash('info', 'New user added');
            req.session.user_id = user.id;
            res.redirect('/');
        }).catch(function (e) {
            for(var i = 0; i < e.errors.length; i++)
            {
                req.flash('info', e.errors[i].message);
            }

            res.redirect('/user/register');
        })
    });

});

module.exports = router;