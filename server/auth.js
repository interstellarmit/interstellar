const { OAuth2Client } = require("google-auth-library");
const User = require("./models/user");
const Comment = require("./models/comment");
const DDQL = require("./models/DDQL");
const GroupPost = require("./models/groupPost");
const Lounge = require("./models/lounge");
const Message = require("./models/message");
const Page = require("./models/page");
const School = require("./models/school");
const socket = require("./server-socket");

const { useReducer } = require("react");
const { check, validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


function logout(req, res) {
  req.session.user = null;
  res.send({});
}

function populateCurrentUser(req, res, next) {
  // simply populate "req.user" for convenience
  req.user = req.session.user;
  next();
}

function ensureLoggedIn(req, res, next) {
  if (!req.user) {
    return res.status(401).send({ err: "not logged in" });
  }

  next();
}

function me(req, res, next) {
  const token = req.header("token");
  if (!token) return res.status(401).json({ message: "Auth Error" });

  try {
    const decoded = jwt.verify(token, "randomString");
    req.user = decoded.user;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Invalid Token" });
  }
};

async function signUp(req, res) {
  console.log(req.body)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({
          errors: errors.array()
      });
  }

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  try {
      let user = await User.findOne({
          email: email
      });
      if (user) {
          return res.status(400).json({
              msg: "User Already Exists"
          });
      }
      let schoolEmail = encodeURI(email.split("@")[1].replace(/ /g, "_"));
      let school = await School.findOne({email: schoolEmail});
         user = new User({
          name: name,
          email: email,
          schoolId: school ? school._id : "None"
         })

         const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
          user: {
              id: user.id
          }
      };

      jwt.sign(
          payload,
          "randomString", {
              expiresIn: 10000
          },
          (err, token) => {
              if (err) throw err;
              res.status(200).json({
                  token
              });
          }
      );

  } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
  }
}


async function login(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const email = req.body.email;
  const password = req.body.password;

  try {
    let user = await User.findOne({
      email
    });
    if (!user)
      return res.status(400).json({
        message: "User Not Exist"
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({
        message: "Incorrect Password !"
      });

    req.session.user = user

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      "randomString",
      {
        expiresIn: 3600
      },
      (err, token) => {
        if (err) throw err;
       
        res.status(200).json({
          token
        });
      }
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server Error"
    });
  }
}

module.exports = {
  login,
  logout,
  populateCurrentUser,
  ensureLoggedIn,
  me,
  signUp,
};
