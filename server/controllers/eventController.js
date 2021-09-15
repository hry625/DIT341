var express = require('express');
var router = express.Router();
var CalendarEvent = require('../models/calendarEvent');

router.post('/api/events', function(req, res, next) {
    var calendarEvent = new CalendarEvent(req.body);
    calendarEvent.save(function(err, calendarEvent) {
        if (err) { return next(err); }
        res.status(201).json(calendarEvent);
    })
});

//update,delete,read

router.get('/api/events', function(req, res, next) {
    var attribute = req.body;
    //var calendarEvent = new CalendarEvent();
    CalendarEvent.findOne(attribute, function(err, calendarEvent) {
        if (err) { return next(err); }
        res.status(201).json(calendarEvent);
    });
})

router.delete('/api/events', function(req, res, next) {
    var attribute = req.body;

    CalendarEvent.deleteOne(attribute, function(err, calendarEvent) {
        if (err) { return next(err); }
        //var object = JSON.parse(attribute);
        res.status(200).json({ 'message': 'Successfully deleted ' });
        //Todo: How to display the event that was deleted
        //console.log(object)
        //res.status(201).json({'message': 'Successfully deleted ' + object[0] });
    })
})

router.get('/api/events/:eventID', function(req, res, next) {
    var eventID = req.params.eventID;
    CalendarEvent.findByID(eventID, function(err, calendarEvent) {
        if (err) { return next(err); }
        res.status(201).json(calendarEvent);
    })
})

router.delete('/api/events/:eventID', function(req, res, next) {
    var eventID = req.params.eventID;
    CalendarEvent.findByIdAndRemove(eventID, function(err, calendarEvent) {
        if (err) { return next(err); }
        res.status(200).json({ 'message': 'Successfully deleted ' });
    })
})

router.put('/api/events/:eventID', function(req, res, next) {
    var eventID = req.params.eventID;
    CalendarEvent.findByIdAndUpdate(eventID, req.body, function(err, calendarEvent) {
            if (err) { return next(err); }
            res.status(201).json(calendarEvent);
        })
        //TODO: Check with TA about should it be replace or what?
})

router.patch('/api/events/:eventID', function(req, res, next) {
    var eventID = req.params.eventID;
    CalendarEvent.findByIdAndUpdate(eventID, req.body, function(err, calendarEvent) {
        if (err) { return next(err); }
        res.status(201).json(calendarEvent);
    })
})



module.exports = router;