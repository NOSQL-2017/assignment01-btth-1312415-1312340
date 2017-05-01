const express = require('express');
const router = express.Router();
const Authentication = require('../modules/authentication');
const Category = require('../models/Category');
const CategoryMap = require('../models/CategoryMap');

const _ = require('lodash');

router.get('/',Authentication, function (req, res) {
    if(!req.user.admin){
        res.redirect('/');
        return;
    }
    Category.find({}).then(function (categories) {
        res.render('category',{
            page: 'category',
            categories: categories
        })
    })

});
router.post('/',Authentication, function (req, res) {
    if(!req.user.admin){
        res.redirect('/');
        return;
    }
    var body = _.pick(req.body, ['name']);
    body.name = body.name.replace(/\s/g, '');
    var category = new Category(body);
    category.save().then(function (catagory) {
        req.flash('info', 'New category added');
        res.redirect('/category');
    }).catch(function (e) {
        req.flash('info', e.errors.name.message);
        res.redirect('/category');
    })
});

router.post('/add/:id',Authentication, function (req, res) {
    CategoryMap.findOne({book: req.params.id }).then(function (categoryMap) {
        Category.findOne({name: req.body.name}).then(function (category) {
            var Check = false;
            categoryMap.category.forEach(function (cate) {
                if(cate.toString() === category.id.toString()){
                    Check = true;
                }
            });
            if(Check){
                req.flash('info','already have that category');
                res.redirect('/book/' + req.params.id);
                return;
            }
            categoryMap.category.push(category.id);
            categoryMap.save().then(function () {
                res.redirect('/book/' + req.params.id);
            })
        })
    }).catch(function (e) {
        res.send(e);
    })
});

module.exports = router;