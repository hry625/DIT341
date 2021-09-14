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
    eventID : { type: String },
    status : { type: String, enum:INVITEESTATUS},
});

module.exports = mongoose.model('invitee', calendarEventSchema);

