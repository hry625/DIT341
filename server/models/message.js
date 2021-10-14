// groupid senderid, timestamp
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    groupID: {type: String},
    messages: [{
        username: {type: String},
        content: {type: String},
        timestamp: {type: Date}
    }]
})

module.exports = mongoose.model('message',messageSchema);