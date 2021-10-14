var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var groupSchema = new Schema({
    name: {type: String},
    groupMember: [{
        username: {type: String},
        userID: {type: String},
        timestamp: {type: Date}
    }]
})

module.exports = mongoose.model('group',groupSchema);
