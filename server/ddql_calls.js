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
Returns: DDQL
Description: Creates the DDQL and returns it
*/
createNewDDQL = (req, res) => {

}


/*
editDDQL
Input (req.body): {
	objectId: String,
title: String,
	dueDate: Date,
	url: String,
	visibility: String ("Public" or "Only Me")

}
Precondition: 
Socket: 
Returns: DDQL
Description: Edits the DDQL and resaves it. Returns the edited DDQL
*/
editDDQL = (req, res) => {

}

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
Returns: {}
Description: Updates addedUserIds or completedUserIds in the corresponding DDQL (s).
*/ 
addOrCompleteDDQL = (req, res) => {


}


module.exports = {
  createNewDDQL,
  editDDQL,
  addOrCompleteDDQL,
};
