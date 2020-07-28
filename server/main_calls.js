const User = require("./models/user");
const Comment = require("./models/comment");
const DDQL = require("./models/DDQL");
const GroupPost = require("./models/groupPost");
const Lounge = require("./models/lounge");
const Message = require("./models/message");
const Page = require("./models/page");
const School = require("./models/school");
const socket = require("./server-socket");
const { useReducer } = require("react");
const lounge_calls = require("./lounge_calls");

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
    name = encodeURI(name);
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

//!!! Make sure no other page has same name... not implemeenteed yet!
createNewPage = (req, res) => {
  School.findById(req.user.schoolId).then((school) => {
    if (school.adminIds.includes(req.user._id) || req.user.isSiteAdmin) {
      let page = new Page({
        pageType: req.body.pageType,
        name: req.body.name,
        title: req.body.title,
        description: req.body.desciption,
        expiryDate: expiryDate,
        adminIds: [req.user._id],
        schoolId: req.user.schoolId,
        locked: req.body.locked,
        joinCode: req.body.joinCode || "",
      });
      page.save().then(() => {
        res.send({ created: true });
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
      if (user.pageIds.includes(page._id)) {
        user.pageIds = user.pageIds.filter((id) => {
          return id !== page._id;
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
  Page.findOne({ name: req.body.pageName, schoolId: req.body.schoolId }).then((page) => {
    if(page) {
      socket.join("Page: " + page._id);
    }
    User.findById(req.user._id).then((user) => {
      let pageArr = [page._id];

      if (req.body.home) {
        pageArr = user.pageIds;
      }

      User.find({ pageIds: { $in: pageArr } }, (err, users) => {
        let condensedUsers = users.map((singleUser) => {
          return { userId: singleUser._id, name: singleUser.name };
        });
        if (user.pageIds.includes(page._id) || page._id === "Home") {
          DDQL.find(
            {
              pageId: { $in: pageArr },
              $or: { addedUserIds: req.user._id, visibility: "Public" },
              deleted: false,
            },
            (err, DDQLs) => {
              Lounge.find({ pageId: { $in: pageArr } }, (err, lounges) => {
                let returnValue = {
                  users: condensedUsers,
                  lounges: lounges,
                  dueDates: DDQLs.filter((ddql) => {
                    return ddql.objectType == "DueDate";
                  }),
                  quickLinks: DDQLs.filter((ddql) => {
                    return ddql.objectType == "QuickLink";
                  }),
                };
                if (page._id !== "Home") {
                  returnValue.page = page;
                }
                res.send(returnValue);
              });
            }
          );
        } else {
          res.send({ users: condensedUsers, page: page });
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
  if(req.body.home) {
    res.send({})
    return;
  }
  Page.findOne({ name: req.body.pageName, schoolId: req.body.schoolId }).then((page) => {
    socket.leave("Page: " + page._id);
    User.findById(req.user._id).then((user) => {
      lounge_calls.removeSelfFromLounge(user.loungeId).then(() => {
        res.send({});
      });
    });
  });
};

module.exports = {
  createNewSchool,
  createNewPage,
  addSelfToPage,
  removeSelfFromPage,
  joinPage,
  leavePage,
};
