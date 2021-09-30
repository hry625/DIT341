var express = require('express');
var router = express.Router();
var Invitee = require('../models/invitee').inviteeModel;
var CalendarEvent = require('../models/calendarEvent').calendarEventModel;
// get--done
router.get('/api/events/:eventID/invitees', function(req, res, next) {
    if(req.query.fields!= null){
        var field = req.query.fields;
        CalendarEvent.findById(req.params.eventID, field, function(err, calendarEvent) {
            if (err) { return next(err); }
            console.log(calendarEvent);
            console.log("0");
    
            res.status(201).json(calendarEvent);
        });

    }else{
        CalendarEvent.findById(req.params.eventID, function(err, calendarEvent) {
            console.log("1");
            if (err) { return next(err); }
            res.status(201).json(calendarEvent.invitees);
        });
    }


});

router.get('/api/events/:eventID/invitees', function(req, res, next) {
    var field = req.query.fields;
    CalendarEvent.find(req.params.eventID, field, function(err, calendarEvent) {
        if (err) { return next(err); }
        console.log(calendarEvent);
        console.log(calendarEvent.invitees);

        res.status(201).json(calendarEvent.invitees);
    });
});

router.post('/api/events/:eventID/invitees', function(req, res, next) {
    var invitee = new Invitee(req.body);
    CalendarEvent.findByIdAndUpdate({ '_id': req.params.eventID }, { $push: { 'invitees': invitee } },{new:true}, function(err, doc) {
        console.log('I am here');
        if (err) { return next(err); }
        res.status(201).json(doc);
    })

});

router.get('/api/events/:eventID/invitees/:inviteeID', function(req, res, next) {
    var inviteeID = req.params.inviteeID;
    CalendarEvent.findById({ '_id': req.params.eventID }, function(err, event) {
        if (err) { return next(err); }
        var invitee = event.invitees.id(inviteeID);
        res.status(201).json(invitee);
    });  


});


router.delete('/api/events/:eventID/invitees/:inviteeID', function(req, res, next) {
    CalendarEvent.findByIdAndRemove({ '_id': req.params.eventID, 'invitees._id': req.params.inviteeID }, function(err, invitee) {
        if (err) { return next(err); }
        res.status(200).json({ 'message': 'Successfully deleted ' });
    });
});



//update,delete,read




module.exports = router;