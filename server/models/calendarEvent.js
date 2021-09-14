var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Invitee = require('./invitee');

var calendarEventSchema = new Schema({
    description : { type: String },
    time : { type: Date },
    title : { type: String},
    invitees : { type: [Invitee]}
    //Maybe status?
});

module.exports = mongoose.model('calendarEvent', calendarEventSchema);
