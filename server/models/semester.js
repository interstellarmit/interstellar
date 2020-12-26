const mongoose = require("mongoose");

const SemesterSchema = new mongoose.Schema({
  name: String, // "Fall 2017"
  identifier: String, // fall-2017
  versionNumber: Number,
});

// compile model from schema
module.exports = mongoose.model("semester", SemesterSchema);
