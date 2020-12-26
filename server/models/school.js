const mongoose = require("mongoose");

const SemesterSchema = new mongoose.Schema({
  name: String, // "MIT" or "Harvard"
  firehoseIdentifier: String,
});

// compile model from schema
module.exports = mongoose.model("semester", SemesterSchema);
