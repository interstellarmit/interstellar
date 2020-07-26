const mongoose = require("mongoose");

const DDQLSchema = new mongoose.Schema({
  title: String,
  dueDate: {
    type: Date,
    default: Date.now,
  },
  objectType: String, // ("DueDate" or "QuickLink")
  url: String, // ("" if no URL)
  pageId: String,
  visibility: String, // ("Public" or "Only Me"),
  creatorId: String,
  addedUserIds: [String], //  (the users who added this duedate),
  completedUserIds: [String], // (the users who completed this duedate)
});

// compile model from schema
module.exports = mongoose.model("DDQL", DDQLSchema);
