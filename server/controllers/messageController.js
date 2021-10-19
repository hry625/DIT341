var express = require('express');
var router = express.Router();
var Message = require('../models/message');

router.post('/api/message/:groupID',function(req,res,next){
    var gID = req.params.groupID
    var content = {
        username: req.body.username,
        content: req.body.content,
        timestamp: req.body.timestamp
    }
    Message.countDocuments({groupID: gID}, function (err, count){ 
        if(count>0){
            Message.findOneAndUpdate({groupID:gID},{$addToSet: { 'messages': content }},function(error,resmessage){
                if (error) { return next(error); }
                console.log("add to exist ")
                res.status(201).json(resmessage);
            })
            
        }else{
            var message = new Message({
                groupID : gID,
                messages: [content]
            })
            message.save(function(error,resmessage){
                if (error) { return next(error); }
                console.log("add to new ")
                res.status(201).json(resmessage);
            })
        }
    }); 


})

router.get('/api/message/:groupID',function(req,res,next){
    Message.find({groupID: req.params.groupID}, function(err, message){
        if (err){return next(err)}
        console.log(message)
        res.status(201).json(message)
    })
})


module.exports = router;