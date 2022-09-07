/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");
require("dotenv").config();
// import models so we can interact with the database
const User = require("./models/user");
const Page = require("./models/page");

// import all libraries
const auth = require("./auth");
const fireroad = require("./fireroad");
const main_calls = require("./main_calls");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//signin/user stuff
router.get("/signUpLogin", auth.signUpLogin);

let allPagesMap = {};

let getAllPages = async (semester) => {
  let term = semester.split("-")[0];

  let year = parseInt(semester.split("-")[1]);

  let pagesGroups = await Page.find({
    pageType: "Group",
  }).select(
    "lastUpdated name _id title pageType numPeople is_historical not_offered_year offered_spring offered_fall offered_IAP offered_summer"
  );

  let allPages = [];

  if (allPagesMap[semester]) allPages = allPagesMap[semester];
  else {
    let pagesClasses = await Page.find({
      pageType: "Class",
    }).select(
      "lastUpdated name _id title pageType numPeople is_historical not_offered_year offered_spring offered_fall offered_IAP offered_summer"
    );

    await Promise.all(
      pagesClasses.map((page) => {
        // get classes that are available this semester
        //console.log(page);
        if (
          semester === process.env.CURRENT_SEMESTER &&
          page.pageType === "Class" &&
          page.lastUpdated !== process.env.CURRENT_SEMESTER
        )
          return;
        if (page.pageType === "Class" && term === "spring" && !page.offered_spring) return;
        if (page.pageType === "Class" && term === "iap" && !page.offered_IAP) return;
        if (page.pageType === "Class" && term === "summer" && !page.offered_summer) return;
        if (page.pageType === "Class" && term === "fall" && !page.offered_fall) return;
        if (page.pageType === "Class" && page.is_historical) return;
        if (
          page.pageType === "Class" &&
          page.not_offered_year &&
          parseInt(page.not_offered_year.split("-")[term === "spring" || term === "iap" ? 1 : 0]) ==
            year
        )
          return;

        allPages.push({
          _id: String(page._id),
          name: page.name,
          title: page.title,
          pageType: page.pageType,
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
        numPeople: page.numPeople,
      });
    })
  );
  return allPages.concat(myGroups);
};
router.post("/updateSemester", async (req, res) => {
  let semester = req.body.semester || process.env.CURRENT_SEMESTER;
  let allPages = await getAllPages(semester);

  if (!req.user || !req.user._id) {
    res.send({ pageIds: [], allPages });
  } else {
    let user = await User.findById(req.user._id);
    let pageIds = user.pageIds
      .filter((id) => {
        return id.semester === semester || id.semester === "All";
      })
      .map((id) => {
        return id.pageId;
      });

    res.send({ pageIds: pageIds, allPages });
  }
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

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

router.post("/createNewPage", auth.ensureLoggedIn, main_calls.createNewPage);
router.post("/addSelfToPage", auth.ensureLoggedIn, main_calls.addSelfToPage);
router.post("/joinPage", main_calls.joinPage);
router.post("/viewProfile", auth.ensureLoggedIn, main_calls.viewProfile);
router.post("/removeSelfFromPage", auth.ensureLoggedIn, main_calls.removeSelfFromPage);
router.post("/getRedirectLink", main_calls.getRedirectLink);
router.post("/setVisible", auth.ensureLoggedIn, main_calls.setVisible);
router.post("/setProfileVisible", auth.ensureLoggedIn, main_calls.setProfileVisible);
router.post("/addRemoveAdmin", auth.ensureLoggedIn, main_calls.addRemoveAdmin);
router.post("/editProfile", auth.ensureLoggedIn, main_calls.editProfile);
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
  let semester = req.body.semester || process.env.CURRENT_SEMESTER;
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
    Page.findOne({ name: pageName, pageType: "Class" }).then((page) => {
      if (page.pageType === "Class") {
        User.findById(req.user._id).then((user) => {
          if (!user.pageIds.includes(page._id)) {
            user.pageIds.push({ pageId: page._id + "", semester: semester });
            userPageIds = user.pageIds;
            user.save().then(() => {
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

router.post("/updateSemester", auth.ensureLoggedIn, (req, res) => {
  if (!req.user.isSiteAdmin) return;
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
