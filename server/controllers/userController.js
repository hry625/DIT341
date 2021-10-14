var express = require("express");
var router = express.Router();
var User = require("../models/user");
var authRequiredMiddleware = require("../middlewares/authRequired");
let calendarEventSchema = require("../models/calendarEvent");
const jwt = require("jsonwebtoken");

router.post("/api/register", async function (req, res) {
  try {
    let {
      firstName,
      lastName,
      email,
      username,
      // password
    } = req.body;

    let ifExists = await User.findOne({
      username,
    }).lean();
    if (ifExists) {
      return res.json({
        status: "error",
        text: "user alredy registred",
      });
    }


    let userCount = function (User) {
      return User + 1;
    };

    let newUser = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      // password: password
    });
    await newUser.save();
    console.log(newUser);
    res.json({
      status: "success",
      text: "user registred",
    });
  } catch (e) {
    console.log(e);
    res.json({
      status: "error",
      text: "iternal server error",
    });
  }
});
router.post("/api/auth", async function (req, res) {
  try {
    let { email, password, uid } = req.body;
    console.log(req.body);
    let ifExists = await User.findOne({
      email,
    }).lean();

    if (ifExists == null) {
      return res.json({
        status: "error",
        text: "user not found",
      });
    }
    if (password == ifExists.password) {
      ifExists.password = null;
      const jwtToken = jwt.sign(
        {
          ifExists,
        },
        "SECRET"
      );

      // await setSession(jwtToken, uid)
      res.json({
        status: "success",
        text: "auth successful",
        data: {
          JWT: jwtToken,
        },
      });
    } else {
      res.json({
        status: "error",
        text: "incorrect password",
      });
    }
  } catch (e) {
    console.log(e);
    res.json({
      status: "error",
      text: "iternal server error",
    });
  }
});

router.get(
  "/api/getMyInfo*",
  // authRequiredMiddleware,
  async function (req, res) {
    try {
      console.log(req.user);
      // let id = req.user._id;
      const email = req.query.email;
      let data = await User.findOne(
        {
          email: email,
        },
        {
          password: 0,
        }
      ).lean();

      res.json({
        status: "success",
        text: "userData",
        data,
      });
    } catch (e) {
      console.log(e);
      res.json({
        status: "error",
        text: "iternal server error",
      });
    }
  }
);
router.post(
  "/api/getMyPlan",
  authRequiredMiddleware,
  async function (req, res) {
    try {
      let data = await calendarEventSchema
        .find({
          createdBy: req.user._id,
        })
        .lean();
      res.json({
        status: "success",
        text: "calendarData",
        data,
      });
    } catch (e) {
      console.log(e);
      res.json({
        status: "error",
        text: "iternal server error",
      });
    }
  }
);
router.post(
  "/api/getUserPlan",
  authRequiredMiddleware,
  async function (req, res) {
    try {
      let data = await calendarEventSchema
        .find({
          createdBy: req.body._id,
        })
        .lean();
      res.json({
        status: "success",
        text: "calendarData",
        data,
      });
    } catch (e) {
      console.log(e);
      res.json({
        status: "error",
        text: "iternal server error",
      });
    }
  }
);
router.post("/api/setData", authRequiredMiddleware, async function (req, res) {
  try {
    let { description, time, title } = req.body;
    let newData = new calendarEventSchema({
      createdBy: req.user._id,
      description,
      time,
      title,
      invitedUsers: [],
    });
    await newData.save();
    res.json({
      status: "success",
      text: "calendar saved",
    });
  } catch (e) {
    console.log(e);
    res.json({
      status: "error",
      text: "iternal server error",
    });
  }
});
router.post(
  "/api/changeData",
  authRequiredMiddleware,
  async function (req, res) {
    try {
      let { description, time, title, _id } = req.body;
      await calendarEventSchema
        .updateOne(
          {
            _id,
          },
          {
            $set: {
              description,
              time,
              title,
            },
          }
        )
        .lean();
      res.json({
        status: "success",
        text: "calendar saved",
      });
    } catch (e) {
      console.log(e);
      res.json({
        status: "error",
        text: "iternal server error",
      });
    }
  }
);
router.post(
  "/api/deleteData",
  authRequiredMiddleware,
  async function (req, res) {
    try {
      let _id = req.body;
      await calendarEventSchema.deleteOne({
        _id,
      });
      res.json({
        status: "success",
        text: "calendar saved",
      });
    } catch (e) {
      console.log(e);
      res.json({
        status: "error",
        text: "iternal server error",
      });
    }
  }
);

router.post(
  "/api/inviteUser",
  authRequiredMiddleware,
  async function (req, res) {
    try {
      let { UserId, _id } = req.body;
      await calendarEventSchema.updateOne(
        {
          _id,
        },
        {
          $addToSet: {
            invitedUsers: {
              UserId: UserId,
              status: "invited",
            },
          },
        }
      );
      res.json({
        status: "success",
        text: "calendar saved",
      });
    } catch (e) {
      console.log(e);
      res.json({
        status: "error",
        text: "iternal server error",
      });
    }
  }
);

router.post("/api/getUsers", authRequiredMiddleware, async function (req, res) {
  try {
    let data = await User.find(
      {},
      {
        password: 0,
      }
    ).lean();
    res.json({
      status: "success",
      text: "userData",
      data,
    });
  } catch (e) {
    console.log(e);
    res.json({
      status: "error",
      text: "iternal server error",
    });
  }
});
router.post(
  "/api/getMyInvations",
  authRequiredMiddleware,
  async function (req, res) {
    try {
      let data = await calendarEventSchema
        .find({
          "invitedUsers.UserId": req.user._id,
        })
        .lean();
      res.json({
        status: "success",
        text: "userData",
        data,
      });
    } catch (e) {
      console.log(e);
      res.json({
        status: "error",
        text: "iternal server error",
      });
    }
  }
);
router.post(
  "/api/changeInvationStatus",
  authRequiredMiddleware,
  async function (req, res) {
    try {
      await calendarEventSchema
        .updateOne(
          {
            "invitedUsers.UserId": req.user._id,
          },
          {
            $set: {
              "invitedUsers.$.status": req.body.status,
            },
          }
        )
        .lean();
      res.json({
        status: "success",
      });
    } catch (e) {
      console.log(e);
      res.json({
        status: "error",
        text: "iternal server error",
      });
    }
  }
)

// find userEmail
router.get('/api/users', function(req, res, next) {
  var email = req.query.email;
  User.find({email}, function(err, user) {
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
