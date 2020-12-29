const User = require("./models/user");

const Page = require("./models/page");
const Link = require("./models/link");
const socket = require("./server-socket");
const { useReducer } = require("react");

const axios = require("axios");
require("dotenv").config();
let expiryDate = new Date(2021, 1, 20); // expiry date for all classes this semester

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
        expiryDate: expiryDate,
        adminIds: [req.user._id],
        schoolId: req.user.schoolId,
        locked: req.body.locked,
        joinCode: req.body.joinCode || "",
        sameAs: req.body.sameAs || "",
      });
      page.save().then((pg) => {
        socket.getSocketFromUserID(req.user._id).emit("createdPage", {
          page: page,
          userId: req.user._id,
        });
        res.send({ created: true, pageId: pg._id, name: page.name });
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
    if (!page.locked || (page.locked && page.joinCode === req.body.joinCode)) {
      User.findById(req.user._id).then((user) => {
        let semester = page.pageType === "Group" ? "All" : req.body.semester || "spring-2021";
        if (pageIncludes(user.pageIds, { pageId: page._id, semester: semester })) {
          res.send({ added: false });
        } else {
          user.pageIds.push({
            pageId: page._id + "",
            semester: semester,
          });
          user.save().then(() => {
            socket
              .getSocketFromUserID(req.user._id)
              .to("Page: " + page._id)
              .emit("userJoinedPage", {
                pageId: page._id,
                semester: semester,
                user: {
                  userId: req.user._id,
                  name: req.user.visible || page.pageType === "Group" ? req.user.name : "Anonymous",
                },
              });
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
      let semester = page.pageType === "Group" ? "All" : req.body.semester || "spring-2021";
      //console.log(user.pageIds);
      //console.log({ pageId: req.body.pageId, semester: semester });
      if (pageIncludes(user.pageIds, { pageId: req.body.pageId, semester: semester })) {
        console.log("found");
        user.pageIds = user.pageIds.filter((id) => {
          return id.pageId !== req.body.pageId;
        });

        user.save().then(() => {
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

joinPage = (req, res) => {
  console.log("joining page with user ");
  console.log(req.user);
  if (!req.user || !req.user._id || !socket.getSocketFromUserID(req.user._id)) {
    console.log("broken", req.user);
    res.send({ broken: true });
    return;
  }

  Page.findOne({ name: req.body.pageName }).then((page) => {
    if (page) {
      socket.getSocketFromUserID(req.user._id).join("Page: " + page._id);
    }

    User.findById(req.user._id).then(async (user) => {
      let pageArr = [];

      if (req.body.home) {
        pageArr = user.pageIds.map((pg) => {
          return pg.pageId;
        });
        pageArr.forEach((onePageId) => {
          socket.getSocketFromUserID(req.user._id).join("Page: " + onePageId);
        });
      } else {
        pageArr = [page._id];
      }

      let admin = undefined;
      if (page) admin = page.adminIds.length > 0 ? page.adminIds[0] : undefined;
      if (admin) {
        admin = await User.findById(admin);
        admin = admin.name;
      }

      User.find({ "pageIds.pageId": { $in: pageArr } }, async (err, users) => {
        console.log("LENGTH" + users.length);
        let condensedUsers = users.map((singleUser) => {
          if ((req.body.home || page.pageType === "Class") && !singleUser.visible)
            return { userId: singleUser._id, name: "Anonymous" };
          return { userId: singleUser._id, name: singleUser.name };
        });
        let inPageUsers = users.map((singleUser) => {
          if (!req.body.home && page.pageType === "Group") {
            return {
              userId: singleUser._id,
              name: singleUser.name,
              pageIds: singleUser.pageIds.map((pg) => {
                return pg.pageId;
              }),
            };
          }
          if ((req.body.home || page.pageType === "Class") && !singleUser.visible)
            return { userId: singleUser._id, name: "Anonymous" };
          return { userId: singleUser._id, name: singleUser.name };
        });
        if (page) {
          page.numPeople = inPageUsers.length;
          await page.save();
        }
        let semester =
          page && page.pageType === "Group" ? "All" : req.body.semester || "spring-2021";
        if (req.body.home || pageIncludes(user.pageIds, { pageId: page._id, semester: semester })) {
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
            users: page.locked ? [] : condensedUsers,
            page: Object.assign(page, { joinCode: "INVISIBLE" }),
            inPage: false,
            hostName: admin,
          });
        }
      });
    });
  });
};

/*
leavePage
Input (req.body): {
	schoolId: String
	pageName: String,
}
Precondition: User is on the page 
Socket: 
Returns: {}
Description: Removes you from the lounge, if you are in one (by calling removeSelfFromLounge). 
*/
leavePage = (req, res) => {
  if (req.body.home) {
    res.send({});
    return;
  }
  Page.findOne({ name: req.body.pageName }).then((page) => {
    socket.getSocketFromUserID(req.user._id).leave("Page: " + page._id);
    res.send({});
  });
};

setJoinCode = (req, res) => {
  if (req.body.lock && (req.body.code.length > 500 || req.body.code.length < 1)) {
    res.send({ setCode: false });
    return;
  }
  Page.findById(req.body.pageId).then((page) => {
    if (req.user.isSiteAdmin || page.adminIds.includes(req.user._id)) {
      page.locked = req.body.lock;
      page.joinCode = req.body.lock ? req.body.code : "";
      page.save().then(() => {
        socket
          .getSocketFromUserID(req.user._id)
          .to("Page: " + page._id)
          .emit("locked", { pageId: page._id, locked: page.locked });
        res.send({ setCode: true });
      });
    } else {
      res.send({ setCode: false });
    }
  });
};

getRedirectLink = (req, res) => {
  Link.findOne({}).then((ret) => {
    res.send({ link: ret.link });
  });
};

setVisible = (req, res) => {
  User.findById(req.user._id).then((user) => {
    user.visible = req.body.visible;
    user.save().then(() => {
      res.send({ setVisible: true });
    });
  });
};

setShowClasses = (req, res) => {
  Page.findById(req.body.pageId).then((page) => {
    if (!req.user.isSiteAdmin && !page.adminIds.includes(req.user._id)) {
      res.send({ set: false });
      return;
    }
    page.showClasses = req.body.showClasses;
    page.save().then(() => {
      res.send({ set: true });
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

module.exports = {
  createNewPage,
  addSelfToPage,
  removeSelfFromPage,
  joinPage,
  leavePage,
  setJoinCode,
  getRedirectLink,
  setVisible,
  setShowClasses,
  addRemoveAdmin,
};
