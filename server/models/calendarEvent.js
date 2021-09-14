var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var InviteeSchema= require('./invitee').inviteeSchema;

var calendarEventSchema = new Schema({
    description : { type: String },
    time : { type: Date },
    title : { type: String},
    invitees : { type: [InviteeSchema]}
    //Maybe status?
});

module.exports = mongoose.model('calendarEvent', calendarEventSchema);
