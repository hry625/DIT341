var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var calendarEventSchema = new Schema({
    description : { type: String },
    time : { type: Date },
    title : { type: String},
    invitees : { type: [String]}
    //Maybe status?
});

module.exports = mongoose.model('calendarEvent', calendarEventSchema);
