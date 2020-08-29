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
const Comment = require("./models/comment");
const DDQL = require("./models/DDQL");
const GroupPost = require("./models/groupPost");
const Lounge = require("./models/lounge");
const Message = require("./models/message");
const Page = require("./models/page");
const School = require("./models/school");
// import all libraries
const auth = require("./auth");
const main_calls = require("./main_calls");
const lounge_calls = require("./lounge_calls");
const DDQL_calls = require("./ddql_calls");
const forum_calls = require("./forum_calls");
// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//initialize socket
const socket = require("./server-socket");

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
      schoolId: user.schoolId,
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
            res.send({
              user: user,
              allPages: allPages,
              //pages.map((page) => {
              // let newPage = page;
              //newPage.description = "";
              //newPage.joinCode = "INVISIBLE";
              // return newPage;
              //}),
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

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) {
    socket.addUser(req.user, socket.getSocketFromSocketID(req.body.socketid));
    res.send({ init: true });
  } else res.send({ init: false });
});

router.post("/test", (req, res) => {
  const msg = {
    to: "test@example.com",
    from: "test@example.com",
    subject: "Sending with Twilio SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  };
  sgMail.send(msg);
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

router.post("/createNewSchool", auth.ensureLoggedIn, main_calls.createNewSchool);
router.post("/createNewPage", auth.ensureLoggedIn, main_calls.createNewPage);
router.post("/addSelfToPage", auth.ensureLoggedIn, main_calls.addSelfToPage);
router.post("/joinPage", main_calls.joinPage);
router.post("/removeSelfFromPage", auth.ensureLoggedIn, main_calls.removeSelfFromPage);
router.post("/leavePage", auth.ensureLoggedIn, main_calls.leavePage);
router.post("/setJoinCode", auth.ensureLoggedIn, main_calls.setJoinCode);
router.post("/getRedirectLink", main_calls.getRedirectLink);
router.post("/setVisible", auth.ensureLoggedIn, main_calls.setVisible);
router.post("/setSeeHelpText", auth.ensureLoggedIn, main_calls.setSeeHelpText);
router.post("/addRemoveAdmin", auth.ensureLoggedIn, main_calls.addRemoveAdmin);

router.post("/createNewLounge", auth.ensureLoggedIn, lounge_calls.createNewLounge);
router.post("/addSelfToLounge", auth.ensureLoggedIn, lounge_calls.addSelfToLounge);
router.post("/removeSelfFromLounge", auth.ensureLoggedIn, lounge_calls.removeSelfFromLounge);
router.post("/message", auth.ensureLoggedIn, lounge_calls.message);

router.post("/createNewDDQL", auth.ensureLoggedIn, DDQL_calls.createNewDDQL);
router.post("/editDDQL", auth.ensureLoggedIn, DDQL_calls.editDDQL);
router.post("/verifyDDQL", auth.ensureLoggedIn, DDQL_calls.verifyDDQL);
router.post("/addOrCompleteDDQL", auth.ensureLoggedIn, DDQL_calls.addOrCompleteDDQL);

router.post("/joinForum", auth.ensureLoggedIn, forum_calls.joinForum);
router.post("/createNewGroupPost", auth.ensureLoggedIn, forum_calls.createNewGroupPost);
router.post("/createNewComment", auth.ensureLoggedIn, forum_calls.createNewComment);
router.post("/updateGroupPost", auth.ensureLoggedIn, forum_calls.updateGroupPost);
router.post("/updateComment", auth.ensureLoggedIn, forum_calls.updateComment);

router.post("/populateLounges", auth.ensureLoggedIn, (req, res) => {
  if (req.user.email === 'dansun@mit.edu') {
    Page.find({}).then((pages) => {
      pages.forEach((page) => {
        let lounge = new Lounge({
          name: page.name,
          pageId: page._id,
          hostId: req.user._id,
          zoomLink: req.body.zoomLink,
          permanent: true,
          main: true,
        });
        console.log(lounge)
        lounge.save()
      })
    });
  }
})

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
