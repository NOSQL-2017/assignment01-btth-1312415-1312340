const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const CategorySchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, "require name for category"],
        minlength: [3, "require name longer than 3"],
        unique: [true, "this category is already in use"]
    }
});
CategorySchema.plugin(uniqueValidator, {message: '{VALUE} is already in use'});
var Category = mongoose.model("categories", CategorySchema);
module.exports = Category;
