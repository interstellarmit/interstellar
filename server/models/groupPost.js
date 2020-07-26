const mongoose = require("mongoose");

const GroupPostSchema = new mongoose.Schema({
  title: String,
  text: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  userId: String,
  pageId: String,
  labels: [String],
  reacts: int,
});

// compile model from schema
module.exports = mongoose.model("groupPost", GroupPostSchema);
