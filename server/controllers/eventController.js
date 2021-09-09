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

router.get('/api/event', function(req, res, next){
    var attribute = req.body;
    //var calendarEvent = new CalendarEvent();
    CalendarEvent.findOne(attribute, function(err, calendarEvent ){
        if (err) { return next(err); }
        res.status(201).json(calendarEvent);
    });
})

module.exports = router;
