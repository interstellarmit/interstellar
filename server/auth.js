require("dotenv").config();
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
var crypto = require("crypto");
var nodemailer = require("nodemailer");
const Token = require("./models/token");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const { useReducer } = require("react");
const { check, validationResult } = require("express-validator/check");
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
  console.log(req.header("token"));
  const token = req.header("token");
  if (!token) return res.status(401).json({ msg: "Auth Error" });

  try {
    const decoded = jwt.verify(token, "randomString");
    req.user = decoded.user;
    console.log("got to next in backend auth me");
    next();
  } catch (e) {
    //console.error(e);
    console.log("token not verified");
    res.status(200).send({ msg: "Invalid Token" });
  }
}

async function signUp(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  try {
    let user = await User.findOne({
      email: email,
    });
    if (user) {
      return res.status(200).json({
        msg: "User Already Exists",
      });
    }
    let schoolEmail = encodeURI(email.split("@")[1].replace(/ /g, "_"));
    let school = await School.findOne({ email: schoolEmail });
    user = new User({
      name: name,
      email: email,
      schoolId: school ? school._id : "None",
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save(function (err) {
      if (err) {
        return res.status(500).send({ msg: err.message });
      }

      // Create a verification token for this user
      var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString("hex") });
      console.log(token);
      // Save the verification token
      token.save(function (err) {
        if (err) {
          return res.status(500).send({ msg: err.message });
        }

        // Send the email
        // console.log( {user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } )
        // var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
        // var mailOptions = { from: 'no-reply@scholar.chat', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
        // transporter.sendMail(mailOptions, function (err) {
        //     if (err) { return res.status(500).send({ msg: err.message }); }
        //     res.status(200).send('A verification email has been sent to ' + user.email + '.');
        // });

        try {
          console.log("sending");
          const msg = {
            to: email,
            from: process.env.SENDGRID_USERNAME,
            subject: "Account Verification Token",
            text:
              "Hello,\n\n" +
              "Please verify your account by clicking the link: \nhttp://" +
              req.headers.host +
              "/confirmation/" +
              token.token +
              "\n",
          };
          sgMail.send(msg).catch((err) => {
            console.log(err);
          });
          console.log("sent");
        } catch (err) {
          return res.status(500).send({ msg: err.message });
        }
      });
    });
    res.status(200).send({
      type: "succes",
      msg:
        "A verification email has been sent to " +
        user.email +
        ". Please check your spam and/or promotions.",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ msg: "Error in Saving" });
  }
}

function confirmationPost(req, res, next) {
  // Check for validation errors
  console.log("1");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  console.log("2");
  // Find a matching token
  Token.findOne({ token: req.body.token }, function (err, token) {
    if (!token)
      return res.status(200).send({
        type: "not-verified",
        msg: "We were unable to find a valid token. Your token my have expired.",
      });
    console.log("3");
    // If we found a token, find a matching user
    User.findOne({ _id: token._userId, email: req.body.email }, function (err, user) {
      if (!user)
        return res.status(200).send({ msg: "We were unable to find a user for this token." });
      if (user.isVerified)
        return res
          .status(200)
          .send({ type: "already-verified", msg: "This user has already been verified." });

      // Verify and save the user
      user.isVerified = true;
      user.save(function (err) {
        if (err) {
          return res.status(500).send({ msg: err.message });
        }
        res
          .status(200)
          .send({ type: "success", msg: "The account has been verified. Please log in." });
      });
    });
  });
}

function resendTokenPost(req, res, next) {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  User.findOne({ email: req.body.email }, function (err, user) {
    if (!user)
      return res.status(200).send({ msg: "We were unable to find a user with that email." });
    if (user.isVerified)
      return res.status(200).send({ msg: "This account has already been verified." });

    // Create a verification token, save it, and send email
    var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString("hex") });

    // Save the token
    token.save(function (err) {
      if (err) {
        return res.status(500).send({ msg: err.message });
      }

      // Send the email
      // var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
      // var mailOptions = { from: 'no-reply@codemoto.io', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
      // transporter.sendMail(mailOptions, function (err) {
      //     if (err) { return res.status(500).send({ msg: err.message }); }
      //     res.status(200).send('A verification email has been sent to ' + user.email + '.');
      // });

      try {
        console.log("sending");
        const msg = {
          to: email,
          from: process.env.SENDGRID_USERNAME,
          subject: "Account Verification Token",
          text:
            "Hello,\n\n" +
            "Please verify your account by clicking the link: \nhttp://" +
            req.headers.host +
            "/confirmation/" +
            token.token +
            ".\n",
        };
        sgMail.send(msg).catch((err) => {
          console.log(err);
        });
        console.log("sent");
      } catch (err) {
        return res.status(500).send({ msg: err.message });
      }
    });
  });
}

async function login(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const email = req.body.email;
  const password = req.body.password;

  try {
    let user = await User.findOne({
      email,
    });
    if (!user)
      return res.status(200).json({
        msg: "User Not Exist",
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(200).json({
        msg: "Incorrect Password !",
      });

    if (!user.isVerified)
      return res.status(200).json({
        msg: "Email not verified !",
      });

    req.session.user = user;

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      "randomString",
      {
        expiresIn: 3600,
      },
      (err, token) => {
        if (err) throw err;

        res.status(200).json({
          token,
        });
      }
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({
      msg: "Server Error",
    });
  }
}

async function signUpLogin(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  try {
    let user = await User.findOne({
      email: email,
    });
    if (user) {
      console.log("found");
      req.session.user = user;

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;

          res.status(200).json({
            token,
          });
        }
      );
      return;
    }

    let schoolEmail = encodeURI(email.split("@")[1].replace(/ /g, "_"));
    let school = await School.findOne({ email: schoolEmail });
    user = new User({
      name: name,
      email: email,
      schoolId: school ? school._id : "None",
      isVerified: true,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    console.log(user);

    await user.save(function (err) {
      if (err) {
        console.log(err);
        return res.status(500).send({ msg: err.message });
      }
    });

    req.session.user = user;
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      "randomString",
      {
        expiresIn: 3600,
      },
      (err, token) => {
        if (err) throw err;
        console.log("yaya");
        res.status(200).json({
          token,
        });
      }
    );
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ msg: "Error in Saving" });
  }
}

module.exports = {
  login,
  logout,
  populateCurrentUser,
  ensureLoggedIn,
  me,
  signUp,
  confirmationPost,
  resendTokenPost,
  signUpLogin,
};
