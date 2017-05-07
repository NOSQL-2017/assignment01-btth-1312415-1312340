const Schema = require('../modules/neo4j');
var Message = Schema.define('message', {
    recievedUserId: {type: Schema.Number},
    userId:    { type: Schema.Number },
    text: {type: Schema.String},
    title: {type: Schema.String}
});


module.exports = Message;
