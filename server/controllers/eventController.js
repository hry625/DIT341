var express = require('express');
// const calendarEvent = require('../models/calendarEvent');
var router = express.Router();
var CalendarEvent = require('../models/calendarEvent').calendarEventModel;

//Create new calendar event
router.post('/api/events', function(req, res, next) {
    var calendarEvent = new CalendarEvent(req.body);
    calendarEvent.save(function(err, calendarEvent) {
        if (err) { return next(err); }
        res.status(201).json(calendarEvent);
    })
});


router.get('/api/events',function(req,res,next){
    // var usernames = req.query;
    console.log(req.query.usernames)
    CalendarEvent.find( { 'invitees.name' : { $in: req.query.usernames } },function(err, calendarEvent){
        if (err) { return next(err);}
        res.status(201).json(calendarEvent)
    })
})

//Find all events
router.get('/api/events', function(req, res, next) {
    CalendarEvent.find( function(err, calendarEvent) {
        if (err) { return next(err); }
        res.status(201).json(calendarEvent);
    });
})

//Filtering events with time and title
router.get('/api/events', function(req, res, next) {
    var eventTime = req.query.start;
    var eventTitle = req.query.name.
    CalendarEvent.find({eventTime, eventTitle}, function(err, calendarEvent) {
        if (err) { return next(err); }
        res.status(201).json(calendarEvent);
    });
})

//sorting and pagination
router.get('/api/events', function(req, res, next) {
    var page = req.query.page;
    var limit = req.query.limit;
    var eventTitle = req.query.title;
    var order = req.query.sort;
    CalendarEvent.find(eventTitle).skip(page * limit ).limit(limit).sort(order).exec(
        function(err, calendarEvent) {
        if (err) { return next(err); }
        res.status(201).json(calendarEvent);
    });
})

//Delete Calendar all event 
router.delete('/api/events', function(req, res, next) {

    CalendarEvent.remove({}, function(err, calendarEvent) {
        if (err) { return next(err); }
        //var object = JSON.parse(attribute);
        res.status(200).json({ 'message': 'Successfully deleted all events' });
        //Todo: How to display the event that was deleted
        //console.log(object)
        //res.status(201).json({'message': 'Successfully deleted ' + object[0] });
    })
})

//Find event by id
router.get('/api/events/:eventID', function(req, res, next) {
    var eventID = req.params.eventID;
    CalendarEvent.findById(eventID, function(err, calendarEvent) {
        if (err) { return next(err); }
        res.status(201).json(calendarEvent);
    })
})



//Delete event by id
router.delete('/api/events/:eventID', function(req, res, next) {
    var eventID = req.params.eventID;
    CalendarEvent.findByIdAndRemove(eventID, function(err, calendarEvent) {
        if (err) { return next(err); }
        res.status(200).json({ 'message': 'Successfully deleted ' });
    })
})


router.put('/api/events/:eventID', function(req, res, next) {
    var eventID = req.params.eventID;
    CalendarEvent.findByIdAndUpdate(eventID, req.body, {new:true}, function(err, calendarEvent) {
            if (err) { return next(err); }
            res.status(201).json(calendarEvent);
        })
        //TODO: Check with TA about should it be replace or what?
})

router.patch('/api/events/:eventID', function(req, res, next) {
    var eventID = req.params.eventID;
    CalendarEvent.findByIdAndUpdate(eventID, req.body, {new:true},function(err, calendarEvent) {
        if (err) { return next(err); }
        res.status(201).json(calendarEvent);
    })
})

module.exports = router;