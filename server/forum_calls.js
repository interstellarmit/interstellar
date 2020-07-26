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
joinForum
Input (req.body): {
	pageId: String,
	inPage: Boolean
}
Precondition: if inPage, User is in the page. 
Socket: none
Returns: if inPage {
	groupPosts: [{post: GroupPost, comments: [Comment]}],
} else {}
Description: If the user is in the page, returns all group posts for this forum
*/
joinForum = (req, res) => {

}

/*
createNewGroupPost
Input (req.body): {
	title: String,
	text: String,
	pageId: String,
	labels: [String]
}
Precondition: User is in page
Socket: 
Returns: GroupPost
Description: Creates, saves, and returns a GroupPost
*/
createNewGroupPost = (req, res) => {

}

/*
createNewComment
Input (req.body): {
	text: String,
	postId: String
}
Precondition: User is in page that the post is in. 
Socket: 
Returns: Comment
Description: Creates, saves, and returns comment
*/
createNewComment = (req, res) => {

}


/*
updateGroupPost
Input (req.body): {
	title: String,
	text: String,
	pageId: String,
	labels: [String],
	delete: Boolean
}
Precondition: User is in page that the post is in, and is also the poster of the Post
Socket: none
Returns: GroupPost
Description: Update post with new title, text, pageId, labels, etc. if deleted is true, then we delete the post as well
*/
updateGroupPost = (req, res)=> {

}

/*
updateComment
Input (req.body): {
	text: String,
	postId: String
	delete: Boolean
}
Precondition: User is in page that the post is in. 
Socket: 
Returns: Comment
Description: Updates comment with new text and postId. If delete is true, then comment is deleted.
*/
updateComment = (req, res) => {
  
}


module.exports = {
  joinForum,
  createNewGroupPost,
  createNewComment,
  updateGroupPost,
  updateComment
};
