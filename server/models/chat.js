var mongoose = require('mongoose')
var Schema = mongoos.Schema;

var chatSchema = new Schema({
    senderID : String,
    content : String,
    timeStamp: Date
})

module.exports = mongoose.model('chat', chatSchema);