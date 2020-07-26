const mongoose = require("mongoose");

const SchoolSchema = new mongoose.Schema({
    name: String,
    email: String, 
    adminIds: [String]
});

// compile model from schema
module.exports = mongoose.model("school", SchoolSchema);
