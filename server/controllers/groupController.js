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

module.exports = router;