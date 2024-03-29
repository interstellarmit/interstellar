const User = require("./models/user");
const Page = require("./models/page");

require("dotenv").config();

/*
createNewPage
Input (req.body): {
  pageType: String,
  name: String,
  title: String,
  description: String,
  locked: Boolean,
  joinCode: String
}
Precondition: req.user.isSiteAdmin or req.user._id is in the page adminIds. Page name is a valid URL string (if not, replace spaces with _, and remove other characters)
Socket: 
Returns: {created: Boolean}
Description: Creates a new page, populating with given info. Sets self as admin. Initially unlocked. Returns true if the page is successfully created.
*/

createNewPage = (req, res) => {
  if (
    req.body.name.length < 2 ||
    req.body.name.length > 20 ||
    req.body.title.length < 2 ||
    req.body.title.length > 100 ||
    req.body.description.length < 10 ||
    req.body.description.length > 10000
  ) {
    res.send({ created: false });
    return;
  }

  let name = req.body.name;
  name = name.replace(/ /g, "_");
  name = name.replace(/[^a-zA-Z0-9-_]/g, "_");

  function getRandomString(length) {
    var randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var result = "";
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }

  if (req.user.isSiteAdmin || req.body.pageType === "Group") {
    Page.findOne({ name: new RegExp("^" + name + "$", "i") }).then((thepage) => {
      if (thepage) {
        res.send({ created: false });
        return;
      }
      let page = new Page({
        pageType: req.body.pageType,
        name: name,
        title: req.body.title,
        description: req.body.description,
        professor: req.body.professor,
        inviteCode: getRandomString(5),
        adminIds: [req.user._id],
        sameAs: req.body.sameAs || "",
      });
      page.save().then((pg) => {
        res.send({ created: true, pageId: pg._id, name: page.name, inviteCode: pg.inviteCode });
      });
    });
  } else {
    res.send({ created: false });
  }
};

/*
addSelfToPage
Input (req.body): {
  pageId: String,
  joinCode: String
}
Precondition: User's school is the page's school. User is not in the page. Page is not locked.  
Socket: "userJoinedPage", {userId: String, name: String}
Returns: {added: Boolean}
Description: Checks if joinCode is correct. If so, Adds the user to the page, else doesn't
*/
let pageIncludes = (list, one) => {
  return list.find((pg) => {
    return pg.pageId + "" === one.pageId + "" && pg.semester === one.semester;
  });
};

addSelfToPage = (req, res) => {
  Page.findById(req.body.pageId).then((page) => {
    if (page.pageType === "Class" || page.inviteCode === req.body.inviteCode) {
      User.findById(req.user._id).then((user) => {
        let semester =
          page.pageType === "Group" ? "All" : req.body.semester || process.env.CURRENT_SEMESTER;
        if (pageIncludes(user.pageIds, { pageId: page._id, semester: semester })) {
          res.send({ added: false });
        } else {
          user.pageIds.push({
            pageId: page._id + "",
            semester: semester,
          });
          user.save().then(() => {
            console.log(`${user.name} added self to page ${page.name}`);
            res.send({ added: true });
          });
        }
      });
    } else {
      res.send({ added: false });
    }
  });
};

/*
removeSelfFromPage
Input (req.body): {
  pageId: String
}
Precondition: User is in the page. 
Socket: 
Returns: {removed: Boolean}
Description: Removes user from the page
*/
removeSelfFromPage = (req, res) => {
  Page.findById(req.body.pageId).then((page) => {
    User.findById(req.user._id).then((user) => {
      let semester =
        page.pageType === "Group" ? "All" : req.body.semester || process.env.CURRENT_SEMESTER;
      //console.log(user.pageIds);
      //console.log({ pageId: req.body.pageId, semester: semester });
      if (pageIncludes(user.pageIds, { pageId: req.body.pageId, semester: semester })) {
        // console.log("found");
        user.pageIds = user.pageIds.filter((id) => {
          return id.pageId !== req.body.pageId;
        });

        user.save().then(() => {
          console.log(`${user.name} removed self from page ${page.name}`);
          res.send({ removed: true });
        });
      } else {
        console.log("not found");
        res.send({ removed: false });
      }
    });
  });
};

/*
joinPage
Input (req.body): {
  schoolId: String
  pageName: String,
}
Socket: 
Returns: if user is in page {
users: [{userId: String, name: String}], dueDates: [DDQL], 
quickLinks: [DDQL], 
lounges: [Lounge], 
page: Page
}

else {users: [{userId: String, name: String}], page: Page}

Description: If the user is in the page, returns the users, due dates that have him in "addedUserIds", quicklinks that have him in "addedUserIds", lounges, and Page. otherwise, just returns users and page. If req.body.home is True, return home stuff! (dueDates for all classes, quickLinks for all classes, lounges for all classes, users for all classes). Note: When returning user list, omit the people who have "visible" false.  (Note: group posts are not included here)
*/

viewProfile = (req, res) => {
  var mongoose = require("mongoose");
  var objectId = mongoose.Types.ObjectId(req.body.pageName);

  User.findById(objectId).then((user) => {
    if (!user.visible) {
      res.send({
        worked: true,
        name: "Anonymous",
        profileVisible: false,
      });
    } else {
      res.send({
        worked: true,
        name: user.name,
        profileVisible: user.profileVisible,
        curLoc: user.curLoc,
        hometown: user.hometown,
        advice: user.advice,
        bio: user.bio,
        activities: user.activities,
        restaurant: user.restaurant,
        myPages: user.pageIds,
        classYear: user.classYear,
      });
    }
  });
  // res.send({
  //   worked: false,
  // })
};

joinPage = (req, res) => {
  Page.findOne({ name: req.body.pageName }).then((page) => {
    User.findById(req.user?._id || undefined).then(async (user) => {
      if (user) {
        console.log(`${user.name} viewing page ${page?.name || req.body.pageName || "undefined?"}`);
      }
      let admin = undefined;
      if (page) admin = page.adminIds.length > 0 ? page.adminIds[0] : undefined;
      if (admin) {
        admin = await User.findById(admin);
        admin = admin ? admin.name : undefined;
      }

      User.find({ "pageIds.pageId": { $in: [page._id] } }, async (err, users) => {
        //console.log("LENGTH" + users.length);
        users = users.filter((user) => {
          return user.pageIds.find((id) => {
            return (
              [page._id]
                .map((s) => {
                  return s + "";
                })
                .includes(id.pageId) &&
              (id.semester === "All" || id.semester === req.body.semester)
            );
          });
        });
        let condensedUsers = users.map((singleUser) => {
          if (page.pageType === "Class" && !singleUser.visible) return { name: "Anonymous" };
          return { userId: singleUser._id, name: singleUser.name };
        });
        let anonymousUsers = users.map((singleUser) => {
          return { name: "Anonymous" };
        });
        let inPageUsers = users.map((singleUser) => {
          if (page.pageType === "Group") {
            return {
              userId: singleUser._id,
              name: singleUser.name,
              pageIds: singleUser.pageIds
                .filter((pg) => {
                  return pg.semester === "All" || pg.semester === req.body.semester;
                })
                .map((pg) => {
                  return pg.pageId;
                }),
            };
          }
          if ((req.body.home || page.pageType === "Class") && !singleUser.visible)
            return { name: "Anonymous" };
          return { userId: singleUser._id, name: singleUser.name };
        });
        if (page) {
          page.numPeople = inPageUsers.length;
          await page.save();
        }
        let semester =
          page && page.pageType === "Group"
            ? "All"
            : req.body.semester || process.env.CURRENT_SEMESTER;
        if (req.user?._id && pageIncludes(user.pageIds, { pageId: page._id, semester: semester })) {
          let returnValue = {
            users: inPageUsers,
            inPage: true,
            hostName: admin,
          };
          if (!req.body.home) {
            returnValue.page = page;
          }
          res.send(returnValue);
        } else {
          res.send({
            users: page.pageType === "Group" || !req.user?._id ? anonymousUsers : condensedUsers,
            page: Object.assign(page, { inviteCode: "INVISIBLE" }),
            inPage: false,
            hostName: admin,
          });
        }
      });
    });
  });
};

getRedirectLink = (req, res) => {
  res.send({ link: process.env.FIREROAD_LINK });
};

setVisible = (req, res) => {
  User.findById(req.user._id).then((user) => {
    user.visible = req.body.visible;
    user.save().then(() => {
      res.send({ setVisible: true });
    });
  });
};

setProfileVisible = (req, res) => {
  User.findById(req.user._id).then((user) => {
    user.profileVisible = req.body.profileVisible;
    user.save().then(() => {
      res.send({ setProfileVisible: true });
    });
  });
};

addRemoveAdmin = (req, res) => {
  Page.findById(req.body.pageId).then((page) => {
    if (!req.user.isSiteAdmin && !page.adminIds.includes(req.user._id)) {
      res.send({ success: false });
      return;
    }
    if (req.body.isAdmin) {
      if (page.adminIds.includes(req.body.userId)) {
        let adminIds = page.adminIds.filter((id) => {
          return id !== req.body.userId;
        });
        page.adminIds = adminIds;
        page.save().then(() => {
          res.send({ success: true });
        });
      } else {
        res.send({ success: false });
      }
    } else {
      if (!page.adminIds.includes(req.body.userId)) {
        let adminIds = page.adminIds;
        adminIds.push(req.body.userId);
        page.adminIds = adminIds;
        page.save().then(() => {
          res.send({ success: true });
        });
      } else {
        res.send({ success: false });
      }
    }
  });
};

async function editProfile(req, res) {
  try {
    const fieldsValue = req.body.fieldsValue;
    User.findById(req.user._id).then((user) => {
      user.curLoc = fieldsValue.curLoc;
      user.hometown = fieldsValue.hometown;
      user.funFact = fieldsValue.funFact;
      user.bio = fieldsValue.bio;
      user.restaurant = fieldsValue.restaurant;
      user.advice = fieldsValue.advice;
      user.activities = fieldsValue.activities;
      user.save().then((user) => {
        res.send({ user });
      });
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ msg: "Error in editting profile" });
  }
}

module.exports = {
  createNewPage,
  addSelfToPage,
  removeSelfFromPage,
  joinPage,
  viewProfile,
  getRedirectLink,
  setVisible,
  setProfileVisible,
  addRemoveAdmin,
  editProfile,
};
