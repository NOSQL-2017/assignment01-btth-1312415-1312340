const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const exphbs  = require('express-handlebars');
const session   = require('express-session');
const flash = require('express-flash');

const UserModel = require('./models/User');
const User = require('./routes/user');
const Book = require('./routes/book');
const DB = require('./db/db');
const DB2 = require('./db/db2');
const Buy = require('./routes/buy');
const Cart = require('./routes/cart');
const Category = require('./routes/category');

const app = express();
app.use(session( {
    secret : process.env.SESSION_SECRET || 'secret',
    resave : false,
    saveUninitialized : false,
    maxAge: null
} ));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser());
app.engine('hbs', exphbs({
    defaultLayout: 'main.hbs',
    partialsDir: __dirname + '/views/partials',
    layoutsDir: __dirname + '/views/layouts'
}));
app.set('view engine', 'hbs');
app.use(flash());




app.get('/' , function(req, res){
    var session = req.session.user_id;
    console.log(session);
    var USER;
    if(session){
        UserModel.findById(req.session.user_id).then(function (user) {
            res.locals.session = user;
            console.log(user.name);
            res.render('index',{
                page: 'index'
            })

        }).catch(function (e) {
            res.locals = null;
            res.render('index',{
                page: 'index'
            });
        })

    }else {
        res.render('index',{
            page: 'index'
        })
    }


});
app.use('/user', User);
app.use('/book', Book);
app.use('/buy', Buy);
app.use('/cart', Cart);
app.use('/category', Category);

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
    console.log('connect to localhost:3000');
});