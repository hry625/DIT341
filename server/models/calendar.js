var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var calendarEventSchema = require('./calendarEvent').calendarEventSchema;

var calendarSchema = new Schema({
    userID : String,
    groupID: String,
    events: [calendarEventSchema]

})
module.export = mongoose.model('calendar', calendarSchema);