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
}
Precondition: if inPage, User is in the page. 
Socket: none
Returns:
- groupPosts: [{post: GroupPost, comments: [Comment]}],
- success: Boolean

Description: If the user is in the page, returns all group posts for this forum
*/
joinForum = (req, res) => {
  // check if user in page
  User.findById(req.user._id).then((user) => {
    if (user.pageIds.includes(req.body.pageId)) {
      // return all GroupPosts + Comments
      GroupPost.find({ pageId: req.body.pageId }, (err, posts) => {
        let groupPosts = [];
        if (posts.length === 0) res.send({ success: true, groupPosts: [] });
        posts.forEach((post) => {
          Comment.find({ postId: post._id }, (err, comments) => {
            groupPosts.push({ post: post, comments: comments });
            if (posts.length === groupPosts.length) {
              res.send({ success: true, groupPosts: groupPosts });
            }
          });
        });
      });
    } else {
      res.send({ success: false });
    }
  });
};

/*
createNewGroupPost
Input (req.body): {
	title: String,
	text: String,
	labels: [String],
	pageId: String,
}
Precondition: User is in page
Socket: 
Returns: GroupPost
Description: Creates, saves, and returns a GroupPost
*/
createNewGroupPost = (req, res) => {
  User.findById(req.user._id).then((user) => {
    // check if user in page
    if (user.pageIds.includes(req.body.pageId)) {
      let post = new GroupPost({
        title: req.body.title,
        text: req.body.text,
        userId: req.user._id,
        pageId: req.body.pageId,
        labels: req.body.labels,
        reacts: [req.user._id],
      });
      post.save().then((savedPost) => {
        res.send({
          post: savedPost,
          created: true,
        });
      });
    } else {
      res.send({ created: false });
    }
  });
};

/*
createNewComment
Input (req.body): {
  text: String,
	pageId: String,
	postId: String
}
Precondition: User is in page that the post is in. 
Socket: 
Returns: Comment
Description: Creates, saves, and returns comment
*/
createNewComment = (req, res) => {
  // check if Post exists
  GroupPost.findById(req.body.postId).then((post) => {
    if (!post) {
      res.send({ created: false });
    } else {
      User.findById(req.user._id).then((user) => {
        // make sure User is in page
        if (user.pageIds.includes(req.body.pageId)) {
          let comment = new Comment({
            text: req.body.text,
            userId: req.user._id,
            pageId: req.body.pageId,
            postId: req.body.postId,
          });

          comment.save().then((commentSaved) => {
            res.send({
              comment: commentSaved,
              created: true,
            });
          });
        } else {
          res.send({
            created: false,
          });
        }
      });
    }
  });
};

/*
deleteGroupPost
Input (req.body): {
  postId: String
}
Precondition: Post exists, user is in page of post, user is poster
Socket: none
Returns: Boolean
Description: Deletes a post
*/
deleteGroupPost = (req, res) => {
  // check if post exists
  GroupPost.findById(req.body.postId).then((post) => {
    if (!post) {
      res.send({ deleted: false });
    } else {
      User.findById(req.user._id).then((user) => {
        // check if user in page + poster
        if (user.pageIds.includes(post.pageId) && post.userId === req.user._id) {
          GroupPost.findByIdAndDelete(req.body.postId).then(() => {
            Comment.deleteMany({ postId: req.body.postId }).then(() => {
              res.send({ deleted: true });
            });
          });
        } else {
          res.send({ deleted: false });
        }
      });
    }
  });
};

/*
updateGroupPost
Input (req.body): {
	postId: String,
	title: String,
	text: String,
	labels: [String],
	reacting: Boolean
}
Precondition: Post exists, user is in page that the post is in, and is also the poster of the Post
Socket: none
Returns: GroupPost
Description: Update post with new title, text, pageId, labels, etc
*/
updateGroupPost = (req, res) => {
  GroupPost.findById(req.body.postId).then((post) => {
    // if post is null
    if (!post) {
      res.send({ updated: false });
    } else {
      // if handling react, don't care if user is poster
      if (req.body.reacting) {
        if (post.reacts.includes(req.user._id)) {
          post.reacts = post.reacts.filter((x) => x !== req.user._id);
        } else {
          post.reacts.push(req.user._id);
        }
        post.save().then((savedPost) => {
          res.send({
            post: savedPost,
            updated: true,
          });
        });
      }
      // else, they need to be poster
      else {
        User.findById(req.user._id).then((user) => {
          // check if user in page + poster
          if (user.pageIds.includes(post.pageId) && post.userId === req.user._id) {
            post.title = req.body.title || post.title;
            post.text = req.body.text || post.text;
            post.labels = req.body.labels || post.labels;
            post.save().then((savedPost) => {
              res.send({
                post: savedPost,
                updated: true,
              });
            });
          } else {
            res.send({ updated: false });
          }
        });
      }
    }
  });
};

/*
updateComment
Input (req.body): {
	text: String,
	postId: String,
	commentId: String,
	delete: Boolean
}
Precondition: Comment exists, user is in page that the comment is in, and is also the poster of Comment
Socket: none
Returns: Comment
Description: Updates comment with new text and postId. If delete is true, then comment is deleted.
*/
updateComment = (req, res) => {
  Comment.findById(req.body.postId).then((comment) => {
    // if comment is null
    if (comment == null) {
      res.send({ updated: false });
    } else {
      User.findById(req.user._id).then((user) => {
        // check if user in page + poster
        if (user.pageIds.includes(comment.pageId) && comment.userId === req.user._id) {
          if (req.body.delete) {
            Comment.findByIdAndDelete(req.body.commentId).then((post) => {
              res.send({ updated: true });
            });
          } else {
            comment.text = req.body.text || comment.text;
            comment.save();
            res.send({
              comment: comment,
              updated: true,
            });
          }
        } else {
          res.send({ updated: false });
        }
      });
    }
  });
};

module.exports = {
  joinForum,
  createNewGroupPost,
  createNewComment,
  updateGroupPost,
  updateComment,
  deleteGroupPost,
};
