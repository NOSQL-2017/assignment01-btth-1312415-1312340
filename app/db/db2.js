var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE2_URL || "mongodb://localhost:27017/bookApp")
    .then(
        console.log('connected to database 2'))
    .catch(function (e) {
        console.log('error: ' + e);
    });