const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  text: String, 
  timestamp: {
    type: Date,
    default: Date.now
  },
  userId: String, 
  pageId: String,
  postId: String
});

// compile model from schema
module.exports = mongoose.model("comment", CommentSchema);
