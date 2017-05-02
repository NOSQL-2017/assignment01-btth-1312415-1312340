const Schema = require('../modules/caminte');
var Follow = Schema.define('Post', {
    followedUserId: {type: Schema.Number},
    userId:    { type: Schema.Number }
});


module.exports = Follow;