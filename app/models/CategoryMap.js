const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoryMapSchema = mongoose.Schema({
    book:{
        type: Number
    },
    category:[{
        type: Schema.Types.ObjectId,
        ref: 'categories'
    }]
});

var CategoryMap = mongoose.model("categoryMaps", CategoryMapSchema);
module.exports = CategoryMap;