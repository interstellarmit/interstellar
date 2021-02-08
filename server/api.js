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
const fireroad = require("./fireroad");
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
const sampleRoad = require("./road.json");
//signin/user stuff
router.get("/signUpLogin", auth.signUpLogin);

let allPagesMap = {};

let getAllPages = async (semester) => {
  let term = semester.split("-")[0];

  let year = parseInt(semester.split("-")[1]);

  let pagesGroups = await Page.find({
    pageType: "Group",
    expiryDate: { $gte: new Date() },
  }).select(
    "name _id title locked pageType numPeople is_historical not_offered_year offered_spring offered_fall offered_IAP offered_summer"
  );

  let allPages = [];

  if (allPagesMap[semester]) allPages = allPagesMap[semester];
  else {
    let pagesClasses = await Page.find({
      pageType: "Class",
      expiryDate: { $gte: new Date() },
    }).select(
      "name _id title locked pageType numPeople is_historical not_offered_year offered_spring offered_fall offered_IAP offered_summer"
    );

    await Promise.all(
      pagesClasses.map((page) => {
        // get classes that are available this semester
        //console.log(page);
        if (page.pageType === "Class" && term === "spring" && !page.offered_spring) return;
        if (page.pageType === "Class" && term === "iap" && !page.offered_IAP) return;
        if (page.pageType === "Class" && term === "summer" && !page.offered_summer) return;
        if (page.pageType === "Class" && term === "fall" && !page.offered_fall) return;
        if (page.pageType === "Class" && page.is_historical) return;
        if (
          page.pageType === "Class" &&
          page.not_offered_year &&
          parseInt(page.not_offered_year.split("-")[term === "spring" ? 1 : 0]) <= year
        )
          return;

        allPages.push({
          _id: String(page._id),
          name: page.name,
          title: page.title,
          pageType: page.pageType,
          locked: page.locked,
          numPeople: page.numPeople,
        });
      })
    );
    allPagesMap[semester] = allPages;
  }

  let myGroups = [];
  await Promise.all(
    pagesGroups.map((page) => {
      myGroups.push({
        _id: String(page._id),
        name: page.name,
        title: page.title,
        pageType: page.pageType,
        locked: page.locked,
        numPeople: page.numPeople,
      });
    })
  );
  return allPages.concat(myGroups);
};
router.post("/updateSemester", async (req, res) => {
  if (!req.user || !req.user._id) {
    res.send({ broken: true });
  }
  let semester = req.body.semester || "spring-2021";
  let allPages = await getAllPages(semester);

  let user = await User.findById(req.user._id);
  let pageIds = user.pageIds
    .filter((id) => {
      return id.semester === semester || id.semester === "All";
    })
    .map((id) => {
      return id.pageId;
    });

  res.send({ pageIds: pageIds, allPages: allPages });
});


router.post("/signContract", auth.ensureLoggedIn, auth.signContract);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }
  User.findById(req.user._id).then((user) => {
    res.send(user);
  });
});

//fireroad related functions
router.get("/sync", fireroad.sync);
router.get("/verify", fireroad.verify);
router.get("/userInfo", fireroad.userInfo);
router.get("/roads", fireroad.roads);

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
router.post("/viewProfile", main_calls.viewProfile);
router.post("/removeSelfFromPage", auth.ensureLoggedIn, main_calls.removeSelfFromPage);
router.post("/leavePage", auth.ensureLoggedIn, main_calls.leavePage);
router.post("/setJoinCode", auth.ensureLoggedIn, main_calls.setJoinCode);
router.post("/getRedirectLink", main_calls.getRedirectLink);
router.post("/setVisible", auth.ensureLoggedIn, main_calls.setVisible);
router.post("/setProfileVisible", auth.ensureLoggedIn, main_calls.setProfileVisible);
router.post("/setHometown", auth.ensureLoggedIn, main_calls.setHometown);
router.post("/setCurLoc", auth.ensureLoggedIn, main_calls.setCurLoc);
router.post("/setAdvice", auth.ensureLoggedIn, main_calls.setAdvice);
router.post("/setRestaurant", auth.ensureLoggedIn, main_calls.setRestaurant);
router.post("/setBio", auth.ensureLoggedIn, main_calls.setBio);
router.post("/setActivities", auth.ensureLoggedIn, main_calls.setActivities);
router.post("/setFunFact", auth.ensureLoggedIn, main_calls.setFunFact);
router.post("/setShowClasses", auth.ensureLoggedIn, main_calls.setShowClasses);
router.post("/addRemoveAdmin", auth.ensureLoggedIn, main_calls.addRemoveAdmin);

router.post("/sameAs", auth.ensureLoggedIn, (req, res) => {
  if (req.user.isSiteAdmin) {
    Page.findOne({ name: req.body.name }).then((page) => {
      //console.log(req.body.name);
      //console.log(page);
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

router.post("/addClasses", auth.ensureLoggedIn, (req, res) => {
  let pageNames = req.body.pageNames;
  let semester = req.body.semester || "spring-2021";
  let userPageIds = [];
  let addPage = (i) => {
    if (i >= pageNames.length) {
      res.send({
        userPageIds: userPageIds
          .filter((id) => {
            return id.semester === semester || id.semester === "All";
          })
          .map((id) => {
            return id.pageId + "";
          }),
      });
      return;
    }
    let pageName = pageNames[i];
    Page.findOne({ name: pageName }).then((page) => {
      if (!page.locked || (page.locked && page.joinCode === req.body.joinCode)) {
        User.findById(req.user._id).then((user) => {
          if (!user.pageIds.includes(page._id)) {
            user.pageIds.push({ pageId: page._id + "", semester: semester });
            userPageIds = user.pageIds;
            user.save().then(() => {
              socket
                .getSocketFromUserID(req.user._id)
                .to("Page: " + page._id)
                .emit("userJoinedPage", {
                  pageId: page._id,
                  semester: semester,
                  user: {
                    userId: req.user._id,
                    name:
                      req.user.visible || page.pageType === "Group" ? req.user.name : "Anonymous",
                  },
                });
              setTimeout(() => {
                addPage(i + 1);
              }, 10);
            });
          } else {
            setTimeout(() => {
              addPage(i + 1);
            }, 10);
          }
        });
      } else {
        setTimeout(() => {
          addPage(i + 1);
        }, 10);
      }
    });
  };
  addPage(0);
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
