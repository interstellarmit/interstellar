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
  deleted: {
    type: Boolean,
    default: false
  },
  addedUserIds: {
    type: [String], //  (the users who added this duedate),
    default: []
  },
  completedUserIds: {
    type: [String], // (the users who completed this duedate)
    default: []
  }
  });

// compile model from schema
module.exports = mongoose.model("DDQL", DDQLSchema);
