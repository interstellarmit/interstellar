const User = require("./models/user");
const Comment = require("./models/comment");
const DDQL = require("./models/DDQL");
const GroupPost = require("./models/groupPost");
const Lounge = require("./models/lounge");
const Message = require("./models/message");
const Page = require("./models/page");
const School = require("./models/school");
const socket = require("./server-socket");

/*
createNewDDQL
Input (req.body): {
	title: String,
	objectType: String ("DueDate" or "QuickLink")
	dueDate: Date,
	url: String,
	pageId: String,
	visibility: String ("Public" or "Only Me")
}

Precondition: User is in the page, Date is not in the past 
Socket: 
Returns: {created: Boolean, DDQL: DDQL}
Description: Creates the DDQL and returns it
*/
createNewDDQL = (req, res) => {
  if (
    (req.body.url && req.body.url.length > 500) ||
    req.body.title.length < 2 ||
    req.body.title.length > 100
  ) {
    res.send({ created: false });
    return;
  }
  User.findById(req.user._id).then((user) => {
    if (user.pageIds.includes(req.body.pageId)) {
      let ddql = new DDQL({
        title: req.body.title,
        objectType: req.body.objectType,
        dueDate: req.body.dueDate,
        url: req.body.url,
        pageId: req.body.pageId,
        visibility: req.body.visibility,
        creatorId: req.user._id,
      });
      ddql.save().then((ddqlSaved) => {
        res.send({ created: true, DDQL: ddqlSaved });
      });
    } else {
      res.send({ created: false });
    }
  });
};

/*
editDDQL
Input (req.body): {
	DDQLId: String,
	title: String,
	dueDate: Date,
	url: String,
	deleted: Boolean

}
Precondition: User is the creator of the DDQL
Socket: 
Returns: {edited: Boolean, DDQL: DDQL}
Description: Edits the DDQL and resaves it. Returns the edited DDQL
*/
editDDQL = (req, res) => {
  DDQL.findById(req.body.DDQLId).then((ddql) => {
    Page.findById(ddql.pageId).then((page) => {
      if (
        ddql.creatorId === req.user._id ||
        req.user.isSiteAdmin ||
        page.adminIds.includes(req.user._id)
      ) {
        ddql.title = req.body.title;
        ddql.dueDate = req.body.dueDate;
        ddql.url = req.body.url;
        if (req.body.deleted) ddql.deleted = true;
        ddql.save().then(() => {
          res.send({ edited: true, DDQL: ddql });
        });
      } else {
        res.send({ edited: false });
      }
    });
  });
};

/*
verifyDDQL
Input (req.body): {
	objectId: String,
	verified: Boolean

}
Precondition: User is the creator of the DDQL
Socket: 
Returns: {edited: Boolean, DDQL: DDQL}
Description: Edits the DDQL and resaves it. Returns the edited DDQL
*/
verifyDDQL = (req, res) => {
  DDQL.findById(req.body.objectId).then((ddql) => {
    Page.findById(ddql.pageId).then((page) => {
      if (req.user.isSiteAdmin || page.adminIds.includes(req.user._id)) {
        ddql.verified = req.body.verified;
        ddql.save().then(() => {
          res.send({ verified: true, DDQL: ddql });
        });
      } else {
        res.send({ verified: false });
      }
    });
  });
};

/*
addOrCompleteDDQL
Input (req.body): {
	objectId: String,
	action: "add" or "remove" or "complete" or "uncomplete"
	amount: "single"
}
or
{
	objectIds: [String],
	action: "add"	
amount: "multiple"
}
Precondition: IF AMOUNT IS SINGLE:  If "add", must not be added; If "remove", must be added; if "complete", must be added and not complete. if "uncomplete", must be added and complete. 
ELSE: action will be ADD, and there will be list of IDs
Socket: 
Returns: {done: Boolean}
Description: Updates addedUserIds or completedUserIds in the corresponding DDQL (s).
*/

addOrCompleteDDQL = (req, res) => {
  if (req.body.amount === "single") {
    DDQL.findById(req.body.objectId).then((ddql) => {
      User.findById(req.user._id).then((user) => {
        if (user.pageIds.includes(ddql.pageId)) {
          let added = ddql.addedUserIds.includes(req.user._id);
          let completed = ddql.completedUserIds.includes(req.user._id);
          if (req.body.action === "add" && !added) {
            ddql.addedUserIds.push(req.user._id);
            ddql.save().then(() => {
              res.send({ done: true });
            });
          } else if (req.body.action === "remove" && added) {
            ddql.addedUserIds = ddql.addedUserIds.filter((id) => {
              return id !== req.user._id;
            });
            ddql.completedUserIds = ddql.completedUserIds.filter((id) => {
              return id !== req.user._id;
            });
            ddql.save().then(() => {
              res.send({ done: true });
            });
          } else if (req.body.action === "complete" && !completed) {
            ddql.completedUserIds.push(req.user._id);
            ddql.save().then(() => {
              res.send({ done: true });
            });
          } else if (req.body.action === "uncomplete" && completed) {
            ddql.completedUserIds = ddql.completedUserIds.filter((id) => {
              return id !== req.user._id;
            });
            ddql.save().then(() => {
              res.send({ done: true });
            });
          } else {
            res.send({ done: false });
          }
        } else {
          res.send({ done: false });
        }
      });
    });
  } else {
    DDQL.find({ _id: { $in: req.body.objectIds } }, (err, ddqls) => {
      User.findById(req.user._id).then((user) => {
        let counter = 0;
        if (ddqls.length === 0) res.send({ done: false });
        ddqls.forEach((ddql) => {
          counter += 1;
          if (user.pageIds.includes(ddql.pageId) && !ddql.addedUserIds.includes(req.user._id)) {
            ddql.addedUserIds.push(req.user._id);
            ddql.save().then(() => {
              if (counter === ddqls.length) res.send({ done: true });
            });
          }
        });
      });
    });
  }
};

module.exports = {
  createNewDDQL,
  editDDQL,
  addOrCompleteDDQL,
  verifyDDQL,
};
