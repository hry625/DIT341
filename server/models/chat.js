var mongoose = require('mongoose')
var Schema = mongoos.Schema;

var chatSchema = new Schema({
    senderID : String,
    content : String,
    timeStamp: Date
})
var chatModel = mongoose.model('chat', chatSchema);

module.exports = {chatSchema, chatModel};