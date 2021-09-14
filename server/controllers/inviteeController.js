var express = require('express');
var router = express.Router();
var Invitee = require('../models/invitee').inviteeModel;
var CalendarEvent = require('../models/calendarEvent');
// get--done
router.get('/api/events/:eventID/invitees',function(req,res,next){
    CalendarEvent.findById(req.params.eventID, function(err, calendarEvent ){
        if (err) { return next(err); }
        res.status(201).json(calendarEvent.invitees);
    });
});

router.post('/api/events/:eventID/invitees', function(req, res, next){
    var invitee = new Invitee(req.body);
    CalendarEvent.findByIdAndUpdate({'_id':req.params.eventID},{$push: {'invitees':invitee}},function(err,doc){
        console.log('I am here');
        if (err) { return next(err); }
        res.status(201).json(doc);
    })
    
});

//update,delete,read




module.exports = router;
