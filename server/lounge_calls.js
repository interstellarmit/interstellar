const User = require("./models/user");
const Comment = require("./models/comment");
const DDQL = require("./models/DDQL");
const GroupPost = require("./models/groupPost");
const Lounge = require("./models/lounge");
const Message = require("./models/message");
const Page = require("./models/page");
const School = require("./models/school");
const socket = require("./server-socket");

var Promise = require('promise');

/*
createNewLounge
Input (req.body): {
	name: String,
	pageId: String,
}
Precondition: User is on the page 
Socket: "newLounge", Lounge (emitted to members of the page)
Returns: Lounge
Description: Adds new lounge to mongo, emits socket telling everyone in page that new lounge is created. 
*/
createNewLounge = (req, res) => {

}

/*
addSelfToLounge
Input (req.body): {
	loungeId: String,
}
Precondition: User is on the page  and not in the lounge
Socket: "userAddedToLounge", {loungeId: String, userId: String}
Returns: {}
Description: user added to lounge, emits socket telling people in page that someone joined lounge (and updates the userlist in lounge object). Updates loungeId in user object. Returns lounge and the list of users in lounge (giving names as well as userIds)
*/
addSelfToLounge = (req, res) => {

}

/*
removeSelfFromLounge
Input (req.body): {
	loungeId: String,
}
Precondition: User is in the lounge
Socket: "userRemovedFromLounge", {loungeId: String, userId: String}
Returns: {}
Description: user removed from lounge, emits socket telling people in page that someone left lounge (and updates the userlist in lounge object). Updates loungeId in user object. 
*/
removeSelfFromLounge = (req, res) => {
	removeSelfFromLoungePromise(req.body.loungeId).then(() => {
		res.send({})
	})
}

removeSelfFromLoungePromise =  new Promise((resolve, reject) => {
	// code for removing self from lounge goes here.. this is just to make it a promise
	resolve();
})

/*
message
Input (req.body): {
	text: String
}
Precondition: User is in the page that the lounge is in. 
Socket: "message", {userId: String, loungeId: String, text: String} (sent to members of that lounge)
Returns: {}
Description: Sends message through socket
*/
message = (req, res) => {
  
}


module.exports = {
  createNewLounge,
  addSelfToLounge,
  removeSelfFromLounge,
  message,
};
