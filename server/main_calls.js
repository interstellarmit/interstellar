const User = require("./models/user");
const Comment = require("./models/comment");
const DDQL = require("./models/DDQL");
const GroupPost = require("./models/groupPost");
const Link = require("./models/link");
const Lounge = require("./models/lounge");
const Message = require("./models/message");
const Page = require("./models/page");
const AdminRequest = require("./models/adminRequest");
const School = require("./models/school");
const socket = require("./server-socket");
const { useReducer } = require("react");
const lounge_calls = require("./lounge_calls");
require("dotenv").config();
let expiryDate = new Date(2021, 1, 20); // expiry date for all classes this semester

/*
createNewSchool
Input (req.body): {
	name: String,
	exampleEmail: String,
	classesString: String
}
Precondition: req.user.isSiteAdmin, name is a valid URL string (if not, replace spaces with '_', and delete other characters)
Socket: 
Returns: {created: Boolean}
Description: Creates a new school. Populates it with whatever classes info is given in classesString 
(perhaps classesString is "6.033 Computer Systems Engineering\n 24.241 Logic\n ..." or something like that) but this string can be blank. adminIds is [req.user._id]. Returns true if the school is successfully created. 
*/
createNewSchool = (req, res) => {
  if (req.user.isSiteAdmin) {
    let name = req.body.name;
    name = name.replace(/ /g, "_");
    name = name.replace(/[^a-zA-Z0-9-_]/g, "_");
    let school = new School({
      name: name,
      email: req.body.email,
      adminIds: [req.user._id],
    });
    school.save().then(() => {
      let classes = req.body.classesString.split("\n");
      if (classes.length === 0) {
        res.send({ created: true });
      } else {
        let added_classes = 0;
        classes.forEach((indiv_class) => {
          let params = indiv_class.replace(/ /, "%%^^2%%").split("%%^^2%%"); // just splitting by the first space.. in a hacky way
          let page = new Page({
            name: params[0],
            title: params[1],
            pageType: "Class",
            schoolId: req.user.schoolId,
            adminIds: [req.user._id],
            expiryDate: expiryDate,
          });
          page.save().then(() => {
            added_classes += 1;
            if (added_classes === classes.length) {
              res.send({ created: true });
            }
          });
        });
      }
    });
  } else {
    res.send({ created: false });
  }
};

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
  School.findById(req.user.schoolId).then((school) => {
    let name = req.body.name;
    name = name.replace(/ /g, "_");
    name = name.replace(/[^a-zA-Z0-9-_]/g, "_");
    if (
      school.adminIds.includes(req.user._id) ||
      req.user.isSiteAdmin ||
      req.body.pageType === "Group"
    ) {
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
          rating: req.body.rating,
          hours: req.body.hours,
          units: req.body.units,
          expiryDate: expiryDate,
          adminIds: [req.user._id],
          schoolId: req.user.schoolId,
          locked: req.body.locked,
          joinCode: req.body.joinCode || "",
        });
        page.save().then((pg) => {
          let lounge = new Lounge({
            name: pg.name,
            pageId: pg._id,
            hostId: req.user._id,
            zoomLink: req.body.zoomLink,
            permanent: true,
            main: true,
          });
          lounge.save();
          res.send({ created: true, pageId: pg._id, name: page.name });
        });
      });
    } else {
      res.send({ created: false });
    }
  });
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
addSelfToPage = (req, res) => {
  Page.findById(req.body.pageId).then((page) => {
    if (page.schoolId === req.user.schoolId) {
      if (!page.locked || (page.locked && page.joinCode === req.body.joinCode)) {
        User.findById(req.user._id).then((user) => {
          if (user.pageIds.includes(page._id)) {
            res.send({ added: false });
          } else {
            user.pageIds.push(page._id);
            user.save().then(() => {
              socket
                .getSocketFromUserID(req.user._id)
                .to("Page: " + page._id)
                .emit("userJoinedPage", {
                  pageId: page._id,
                  user: {
                    userId: req.user._id,
                    name:
                      req.user.visible || page.pageType === "Group" ? req.user.name : "Anonymous",
                  },
                });
              res.send({ added: true });
            });
          }
        });
      } else {
        res.send({ added: false });
      }
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
      if (user.pageIds.includes(req.body.pageId)) {
        user.pageIds = user.pageIds.filter((id) => {
          return id !== req.body.pageId;
        });

        user.save().then(() => {
          res.send({ removed: true });
        });
      } else {
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
  if (!req.user || !req.user._id) {
    console.log("broken", req.user);
    res.send({ broken: true });
    return;
  }

  Page.findOne({ name: req.body.pageName, schoolId: req.body.schoolId }).then((page) => {
    if (page) {
      socket.getSocketFromUserID(req.user._id).join("Page: " + page._id);
    }

    User.findById(req.user._id).then((user) => {
      let pageArr = [];

      if (req.body.home) {
        pageArr = user.pageIds;
        pageArr.forEach((onePageId) => {
          socket.getSocketFromUserID(req.user._id).join("Page: " + onePageId);
        });
      } else {
        pageArr = [page._id];
      }

      User.find({ pageIds: { $in: pageArr } }, (err, users) => {
        let condensedUsers = users.map((singleUser) => {
          if ((req.body.home || page.pageType === "Class") && !singleUser.visible)
            return { userId: singleUser._id, name: "Anonymous" };
          return { userId: singleUser._id, name: singleUser.name };
        });
        let inPageUsers = users.map((singleUser) => {
          if (!req.body.home && page.pageType === "Group") {
            return { userId: singleUser._id, name: singleUser.name, pageIds: singleUser.pageIds };
          }
          if ((req.body.home || page.pageType === "Class") && !singleUser.visible)
            return { userId: singleUser._id, name: "Anonymous" };
          return { userId: singleUser._id, name: singleUser.name };
        });
        if (req.body.home || user.pageIds.includes(page._id)) {
          DDQL.find(
            {
              pageId: { $in: pageArr },
              $or: [{ addedUserIds: req.user._id }, { visibility: "Public" }, { verified: true }],
              deleted: false,
            },
            (err, DDQLs) => {
              Lounge.find({ pageId: { $in: pageArr } }, (err, lounges) => {
                let adminReq =
                  req.body.home && req.user.isSiteAdmin
                    ? { honored: false }
                    : req.body.home
                    ? { pageId: "!!!!!" }
                    : {
                        pageId: page.adminIds.includes(req.user._id) ? page._id : "!!!!!",
                        honored: false,
                      };

                AdminRequest.find(adminReq, (err, requests) => {
                  let returnValue = {
                    users: inPageUsers,
                    lounges: lounges,
                    dueDates: DDQLs.filter((ddql) => {
                      return ddql.objectType == "DueDate";
                    }),
                    quickLinks: DDQLs.filter((ddql) => {
                      return ddql.objectType == "QuickLink";
                    }),
                    inPage: true,
                    adminRequests: requests,
                  };
                  if (!req.body.home) {
                    returnValue.page = page;
                  }
                  res.send(returnValue);
                });
              });
            }
          );
        } else {
          res.send({
            users: page.locked ? [] : condensedUsers,
            page: Object.assign(page, { joinCode: "INVISIBLE" }),
            inPage: false,
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
  Page.findOne({ name: req.body.pageName, schoolId: req.body.schoolId }).then((page) => {
    socket.getSocketFromUserID(req.user._id).leave("Page: " + page._id);
    User.findById(req.user._id).then((user) => {
      lounge_calls.removeSelfFromLounge(user.loungeId).then(() => {
        res.send({});
      });
    });
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

setSeeHelpText = (req, res) => {
  User.findById(req.user._id).then((user) => {
    user.seeHelpText = req.body.seeHelpText;
    user.save().then(() => {
      res.send({ setSeeHelpText: true });
    });
  });
};

requestAdmin = (req, res) => {
  AdminRequest.findOne({ userId: req.user._id, pageId: req.body.pageId, honored: false }).then(
    (request) => {
      if (request) {
        res.send({ alreadyRequested: true });
      } else {
        const newRequest = new AdminRequest({
          userId: req.user._id,
          name: req.user.name,
          pageId: req.body.pageId,
          pageName: req.body.pageName,
        });
        newRequest.save().then(() => {
          res.send({ requested: true });
        });
      }
    }
  );
};

honorRequest = (req, res) => {
  AdminRequest.findById(req.body.requestId).then((request) => {
    request.honored = true;
    request.save().then(() => {
      res.send({ honored: true });
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
  createNewSchool,
  createNewPage,
  addSelfToPage,
  removeSelfFromPage,
  joinPage,
  leavePage,
  setJoinCode,
  getRedirectLink,
  setVisible,
  setSeeHelpText,
  addRemoveAdmin,
  requestAdmin,
  honorRequest,
};
