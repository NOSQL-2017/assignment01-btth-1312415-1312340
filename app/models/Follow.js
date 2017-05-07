const Schema = require('../modules/neo4j');
var Follow = Schema.define('Post', {
    followedUserId: {type: Schema.Number},
    userId:    { type: Schema.Number }
});


module.exports = Follow;