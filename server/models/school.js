const mongoose = require("mongoose");

const SchoolSchema = new mongoose.Schema({
    name: String, // "MIT" or "Harvard"
    email: String,  // "mit.edu" or "harvard.edu"
    adminIds: [String]
});

// compile model from schema
module.exports = mongoose.model("school", SchoolSchema);
