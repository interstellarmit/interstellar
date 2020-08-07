const User = require("./models/user");
const Comment = require("./models/comment");
const DDQL = require("./models/DDQL");
const GroupPost = require("./models/groupPost");
const Lounge = require("./models/lounge");
const Message = require("./models/message");
const Page = require("./models/page");
const School = require("./models/school");
const socket = require("./server-socket");
var ObjectId = require("mongodb").ObjectID;

var Promise = require("promise");

/*
createNewLounge
Input (req.body): {
	name: String,
	pageId: String,
}
Precondition: User is on the page 
Socket: "newLounge", Lounge (emitted to members of the page)
Returns: {created: Boolean, lounge: Lounge}
Description: Adds new lounge to mongo, emits socket telling everyone in page that new lounge is created. 
*/
createNewLounge = (req, res) => {
  User.findById(req.user._id).then((user) => {
    if (user.pageIds.includes(req.body.pageId)) {
      let lounge = new Lounge({
        name: req.body.name,
        pageId: req.body.pageId,
        hostId: req.user._id,
        zoomLink: req.body.zoomLink || "",
      });
      lounge.save().then(() => {
        socket
          .getSocketFromUserID(req.user._id)
          .to("Page: " + req.body.pageId)
          .emit("newLounge", lounge);
        res.send({ created: true, lounge: lounge });
      });
    } else {
      res.send({ created: false });
    }
  });
};

/*
addSelfToLounge
Input (req.body): {
	loungeId: String,
}
Precondition: User is on the page  and not in the lounge
Socket: "userAddedToLounge", {loungeId: String, userId: String}
Returns: {added: Boolean}
Description: user added to lounge, emits socket telling people in page that someone joined lounge (and updates the userlist in lounge object). Updates loungeId in user object. Returns lounge and the list of users in lounge (giving names as well as userIds)
*/
addSelfToLounge = (req, res) => {
  User.findById(req.user._id).then((user) => {
    Lounge.findById(req.body.loungeId).then((lounge) => {
      if (user.pageIds.includes(lounge.pageId) && !lounge.userIds.includes(req.user._id)) {
        lounge.userIds.push(req.user._id);
        lounge.save().then(() => {
          socket
            .getSocketFromUserID(req.user._id)
            .to("Page: " + lounge.pageId)
            .emit("userAddedToLounge", { loungeId: lounge._id, userId: req.user._id });
          socket.getSocketFromUserID(req.user._id).join("Lounge: " + lounge._id);
          user.loungeId = req.body.loungeId;
          user.save().then(() => {
            res.send({ added: true });
          });
        });
      } else {
        res.send({ added: false });
      }
    });
  });
};

/*
removeSelfFromLounge
Input (req.body): {
	loungeId: String,
}
Precondition: User is in the lounge
Socket: "userRemovedFromLounge", {loungeId: String, userId: String}
Returns: {removed: Boolean}
Description: user removed from lounge, emits socket telling people in page that someone left lounge (and updates the userlist in lounge object). Updates loungeId in user object. 
*/
removeSelfFromLounge = (req, res) => {
  removeSelfFromLoungePromise(req.user._id, req.body.loungeId).then((removed) => {
    res.send({ removed: removed });
  });
};

removeSelfFromLoungePromise = (userId, loungeId) => {
  return new Promise((resolve, reject) => {
    // code for removing self from lounge goes here.. this is just to make it a promise
    if (loungeId === "") {
      resolve(true);
    } else {
      User.findById(userId).then((user) => {
        Lounge.findById(loungeId).then((lounge) => {
          if (lounge.userIds.includes(userId)) {
            lounge.userIds = lounge.userIds.filter((id) => {
              return id !== userId;
            });
            let oldPageId = lounge.pageId;
            if (lounge.userIds.length === 0) lounge.pageId = "deleted";

            lounge.save().then(() => {
              socket
                .getSocketFromUserID(userId)
                .to("Page: " + oldPageId)
                .emit("userRemovedFromLounge", { loungeId: lounge._id, userId: userId });
              socket.getSocketFromUserID(userId).leave("Lounge: " + lounge._id);
              user.loungeId = "";
              user.save().then(() => {
                resolve(true);
              });
            });
          } else {
            resolve(false);
          }
        });
      });
    }
  });
};

/*
message
Input (req.body): {
	text: String,
	loungeId: String
}
Precondition: User is in the page that the lounge is in. 
Socket: "message", {userId: String, loungeId: String, text: String} (sent to members of that lounge)
Returns: {}
Description: Sends message through socket
*/
message = (req, res) => {
  let message = {
    userId: req.user._id,
    name: req.user.name,
    loungeId: req.body.loungeId,
    text: req.body.text,
  };
  socket
    .getSocketFromUserID(req.user._id)
    .to("Lounge: " + req.body.loungeId)
    .emit("message", message);
  res.send(message);
};

module.exports = {
  createNewLounge,
  addSelfToLounge,
  removeSelfFromLounge,
  removeSelfFromLoungePromise,
  message,
};
