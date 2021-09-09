var express = require('express');
var router = express.Router();
var CalendarEvent = require('../models/calendarEvent');

router.post('/api/event', function(req, res, next){
    var calendarEvent = new CalendarEvent(req.body);
    calendarEvent.save(function(err, calendarEvent) {
        if (err) { return next(err); }
        res.status(201).json(calendarEvent);
    })
});

//update,delete,read

module.exports = router;
