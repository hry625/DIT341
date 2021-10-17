var express = require('express');
var router = express.Router();
var Group = require('../models/group');

router.post('/api/groups',function(req,res,next){
    // TODO: make sure not duplicated group name
    var group = new Group(req.body)
    group.save(function(err,group){
        if (err) { return next(err); }
        res.status(201).json(group);
    })
})
router.get('/api/groups',function(req,res,next){
    var page = req.query.page
    var limit = parseInt(req.query.limit)
    Group.find().skip(page * limit ).limit(limit).sort({'_id': -1}).exec(
        function(err, calendarEvent) {
        if (err) { return next(err); }
        res.status(201).json(calendarEvent);
    });
})

// find all user's group
router.get('/api/groups',function(req,res,next){
    Group.find( function(err, group) {
        if (err) { return next(err); }
        console.log(group)
        res.status(201).json(group);
    })
})




// find user's group with user's ID
router.get('/api/groups',function(req,res,next){
    var user = req.query.userID
    Group.find({'groupMember.userID':user}, function(err, group) {
        if (err) { return next(err); }
        console.log(group)
        res.status(201).json(group);
    })
})

module.exports = router;