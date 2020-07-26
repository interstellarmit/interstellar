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
// import authentication library
const auth = require("./auth");
const main_calls = require("./main_calls");
const lounge_calls = require("./lounge_calls");
const ddql_calls = require("./ddql_calls");
const forum_calls = require("./forum_calls");
// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socket = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) socket.addUser(req.user, socket.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

router.post("/createNewSchool", auth.ensureLoggedIn, main_calls.createNewSchool)
router.post("/createNewPage", auth.ensureLoggedIn, main_calls.createNewPage)
router.post("/addSelfToPage", auth.ensureLoggedIn, main_calls.addSelfToPage)
router.post("/joinPage", auth.ensureLoggedIn, main_calls.joinPage)
router.post("/removeSelfFromPage", auth.ensureLoggedIn, main_calls.removeSelfFromPage)
router.post("/leavePage", auth.ensureLoggedIn, main_calls.leavePage)

router.post("/createNewLounge", auth.ensureLoggedIn, lounge_calls.createNewLounge)
router.post("/addSelfToLounge", auth.ensureLoggedIn, lounge_calls.addSelfToLounge)
router.post("/removeSelfFromLounge", auth.ensureLoggedIn, lounge_calls.removeSelfFromLounge)
router.post("/message", auth.ensureLoggedIn, lounge_calls.message)

router.post("/createNewDDQL", auth.ensureLoggedIn, DDQL_calls.createNewDDQL)
router.post("/editDDQL", auth.ensureLoggedIn, DDQL_calls.editDDQL)
router.post("/addOrCompleteDDQL", auth.ensureLoggedIn, DDQL_calls.addOrCompleteDDQL)

router.post("/joinForum", auth.ensureLoggedIn, forum_calls.joinForum)
router.post("/createNewGroupPost", auth.ensureLoggedIn, forum_calls.createNewGroupPost)
router.post("/createNewComment", auth.ensureLoggedIn, forum_calls.createNewComment)
router.post("/updateGroupPost", auth.ensureLoggedIn, forum_calls.updateGroupPost)
router.post("/updateComment", auth.ensureLoggedIn, forum_calls.updateComment)

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
