var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var InviteeSchema= require('./invitee').inviteeSchema;

var calendarEventSchema = new Schema({
    details : { type: String },
    start : { type: String },
    end : { type: String },
    name : { type: String},
    invitees : { type: [InviteeSchema]}
    //Maybe status?
});

module.exports = mongoose.model('calendarEvent', calendarEventSchema);
