var mongoose = require('mongoose')
var Schema = mongoos.Schema;

var chatSchema = new Schema({
    senderID : String,
    content : String,
    timeStamp: Date
})

ports = mongoose.model('chat', chatSchema);