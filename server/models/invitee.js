var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var inviteeSchema = new Schema({
    name : { type: String },
});
var inviteeModel= mongoose.model('invitee', inviteeSchema);

module.exports = {inviteeModel,inviteeSchema};

