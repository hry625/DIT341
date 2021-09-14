var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const INVITEESTATUS = {
    Invited:"invited",
    Accepted:"accepted",
    Maybe:"maybe",
    Denied: "denied"

}

var inviteeSchema = new Schema({
    name : { type: String },
    status : { type: String,enum: INVITEESTATUS},
});
var inviteeModel= mongoose.model('invitee', inviteeSchema);

module.exports = {inviteeModel,inviteeSchema};

