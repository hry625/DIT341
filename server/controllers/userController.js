var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.post('/api/users', function(req, res, next) {
    var user = new User(req.body);
    user.save(function(err, user) {
        if (err) { return next(err); }
        res.status(201).json(user);
    })
});

//update,delete,read

router.get('/api/users', function(req, res, next) {
    // var attribute = req.body;
    //var user = new user();
    User.find(function(err, user) {
        if (err) { return next(err); }
        res.status(201).json(user);
    });
})

router.delete('/api/users', function(req, res, next) {
    User.remove({}, function(err, user) {
        if (err) { return next(err); }
        //var object = JSON.parse(attribute);
        res.status(201).json({ 'message': 'Successfully deleted all users' });
        //Todo: How to display the event that was deleted
        //console.log(object)
        //res.status(201).json({'message': 'Successfully deleted ' + object[0] });
    })
})

router.get('/api/users/:userID', function(req, res, next) {
    var userID = req.params.userID;
    User.findById(userID, function(err, user) {
        if (err) { return next(err); }
        res.status(201).json(user);
    })
})

router.delete('/api/users/:userID', function(req, res, next) {
    var userID = req.params.userID;
    User.findByIdAndRemove(userID, function(err, user) {
        if (err) { return next(err); }
        res.status(200).json({ 'message': 'Successfully deleted ' });
    })
})

router.put('/api/users/:userID', function(req, res, next) {
    var userID = req.params.userID;
    User.findByIdAndUpdate(userID, req.body, function(err, user) {
            if (err) { return next(err); }
            res.status(201).json(user);
        })
        //TODO: Check with TA about should it be replace or what?
})

router.patch('/api/users/:userID', function(req, res, next) {
    var userID = req.params.userID;
    User.findByIdAndUpdate(userID, req.body, function(err, user) {
        if (err) { return next(err); }
        res.status(201).json(user);
    })
})



module.exports = router;