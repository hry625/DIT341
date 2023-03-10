var express = require("express");
var router = express.Router();
var User = require("../models/user");
var authRequiredMiddleware = require("../middlewares/authRequired");
let calendarEventSchema = require("../models/calendarEvent");
const jwt = require("jsonwebtoken");


// create a user
router.post("/api/users", async function (req, res) {
  try {
    var username = req.body.username
    // let {
    //   firstName,
    //   lastName,
    //   email,
    //   username,
    //   // password
    // } = req.body;

    let ifExists = await User.findOne({
      username,
    }).lean();
    if (ifExists) {
      return res.status(403).json({
        status: "error",
        text: "user alredy registred",
      });
    }


    // let userCount = function (User) {
    //   return User + 1;
    // };

    let newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      // password: password
    });
    await newUser.save();
    console.log(newUser);
    res.status(201).json({
      status: "success",
      text: "user registred",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: "error",
      text: "iternal server error",
    });
  }
});

// find all users
router.get("/api/users", function (req, res, next) {
  User.find(function (err, user) {
    if (err) {
      return next(err);
    }
    console.log(user);
    res.status(201).json(user);
  });
});

// find userEmail
// router.get("/api/users/:email", function (req, res, next) {
//   var {email} = req.params;
//   user.find({ email }, function (err, user) {
//     if (err) {
//       return next(err);
//     }
//     console.log(user);
//     res.status(201).json(user);
//   });
// });

//delete user by email
router.delete("/api/users/:email", function (req, res, next) {
  const email = req.params.email;
  console.log(email);

  User.findOneAndDelete({email: email}, function (err, user) {
    if (err) {
      return next(err);
    }
    console.log(user)
    res.status(200).json({ message: "Successfully deleted " });
  });
});


//Delete all users
router.delete("/api/users", function (req, res, next) {
  User.remove({}, function (err, user) {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: "Successfully deleted all users" });
  });
});



//edit user 
router.put("/api/users/:email", function (req, res, next) {
  const email = req.params.email;
  console.log(email)
  User.findOneAndUpdate({email:email}, req.body, (err, user) => {
    if (err) {
      return next(err);
    }
    console.log(user)
    res.status(201).json(user);
  });
});


//edit partially user
router.patch("/api/users/:email", function (req, res, next) {
  var email = req.params.email;
  User.findOneAndUpdate({email:email}, req.body, (err, user) => {
    if (err) {
      return next(err);
    }
    res.status(201).json(user);
  });
});

// find userEmail
router.get('/api/users/:email', function(req, res, next) {
  var email = req.params.email;
  User.findOne({email}, function(err, user) {
      if (err) { return next(err); }
      console.log(user)
      res.status(201).json(user);
  })
})


// router.get('/api/users', function(req, res, next) {
//   var attribute = req.body;
//   User.findOne({email:"test7@gmail.com"},function(err, user) {
//       if (err) { return next(err); }
//       res.status(201).json(user);
//       console.log(user);
//   })
// })

module.exports = router;
