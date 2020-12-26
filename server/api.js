/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
const Page = require("./models/page");

// import all libraries
const auth = require("./auth");
const main_calls = require("./main_calls");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//initialize socket
const socket = require("./server-socket");
const axios = require("axios");

//signin/user stuff
router.post(
  "/signup",
  [
    check("name", "Please Enter a valid name").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a longer password").isLength({
      min: 6,
    }),
  ],
  auth.signUp
);

router.post("/login", [check("email", "Please enter a valid email").isEmail()], auth.login);

router.post("/signUpLogin", auth.signUpLogin);

router.get("/me", auth.me, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    console.log("backend requser" + req.user);
    const user = await User.findById(req.user.id);
    //,
    console.log("start slow part");
    Page.find({
      expiryDate: { $gte: new Date() },
      //pageType: "Group",
    })
      .select("name _id title locked pageType")

      .then((pages) => {
        console.log("end slow part");
        console.log("sending user " + user);
        let allPages = [];
        //console.log("sending pages" + pages);
        pages.forEach((page) => {
          allPages.push({
            _id: String(page._id),
            name: page.name,
            title: page.title,
            pageType: page.pageType,
            locked: page.locked,
          });
          if (allPages.length === pages.length) {
            req.session.user = user;
            res.send({
              user: user,
              allPages: allPages,
            });
          }
        });
      });
  } catch (e) {
    console.log(e);
    res.send({ message: "Error in Fetching user" });
  }
});

router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }
  res.send(req.user);
});

router.post("/confirmation", auth.confirmationPost);
router.post("/resend", auth.resendTokenPost);
router.post("/signContract", auth.ensureLoggedIn, auth.signContract);

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) {
    socket.addUser(req.user, socket.getSocketFromSocketID(req.body.socketid));
    res.send({ init: true });
  } else res.send({ init: false });
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

router.post("/createNewPage", auth.ensureLoggedIn, main_calls.createNewPage);
router.post("/addSelfToPage", auth.ensureLoggedIn, main_calls.addSelfToPage);
router.post("/joinPage", main_calls.joinPage);
router.post("/removeSelfFromPage", auth.ensureLoggedIn, main_calls.removeSelfFromPage);
router.post("/leavePage", auth.ensureLoggedIn, main_calls.leavePage);
router.post("/setJoinCode", auth.ensureLoggedIn, main_calls.setJoinCode);
router.post("/getRedirectLink", main_calls.getRedirectLink);
router.post("/setVisible", auth.ensureLoggedIn, main_calls.setVisible);
router.post("/setShowClasses", auth.ensureLoggedIn, main_calls.setShowClasses);

router.post("/sameAs", auth.ensureLoggedIn, (req, res) => {
  if (req.user.isSiteAdmin) {
    Page.findOne({ name: req.body.name }).then((page) => {
      console.log(req.body.name);
      console.log(page);
      if (!page) {
        res.send({ created: false });
        return;
      }
      page.professor = req.body.professor;
      page.sameAs = req.body.sameAs;
      page.save().then(() => {
        res.send({ created: true });
      });
    });
  }
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
