require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");
const User = require("./models/user");
const Page = require("./models/page");
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

const axios = require("axios");

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


const fetchUserInfo = async (code) => {
  const password = "DH3ordzkbjBra9";
  try {
    let data = await axios({
      url: process.env.FIREROAD_LINK + `fetch_token/?code=${code}`
    })
    data = data.data
    const accessToken = data.access_info.access_token;
    const email = data.access_info.academic_id;

    let userData = await axios({
      url: process.env.FIREROAD_LINK + "user_info",
      headers: { 'Authorization': "Bearer " + accessToken },
    })
    userData = userData.data;
    const name = userData.name;
    return { name, email, password }
  } catch (e) {
    console.log(e)
  }
  return {}
}

const signUpLogin = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  const { code } = req.query;
  const { name, email, password } = await fetchUserInfo(code)
  console.log(name, email, password)
  try {
    let user = await User.findOne({
      email: email,
    });
    if (user) {
      req.session.user = user;
      return res.redirect("/");
    }

    //let schoolEmail = encodeURI(email.split("@")[1].replace(/ /g, "_"));
    // let school = await School.findOne({ email: schoolEmail });
    user = new User({
      name: name,
      email: email,
      //schoolId: school ? school._id : "None",
      isVerified: true,
    });
    console.log(user);
    await user.save(function (err) {
      if (err) {
        console.log(err);
        return res.status(500).send({ msg: err.message });
      }
    });

    req.session.user = user;
    return res.redirect("/");
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ msg: "Error in Saving" });
  }
}

async function signContract(req, res) {
  User.findOne({ email: req.user.email }).then((user) => {
    user.signedContract = true;
    user.save().then(() => {
      res.send({ success: true });
    });
  });
}

module.exports = {
  logout,
  populateCurrentUser,
  ensureLoggedIn,
  signUpLogin,
  signContract,
};
