<<<<<<< HEAD
// groupID, name, members
=======
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var chatSchema = require('./chat').chatSchema

var groupSchema = new Schema({
    chats:[chatSchema]

})

module.export = mongoose.model('group',groupSchema);
>>>>>>> olga-user
