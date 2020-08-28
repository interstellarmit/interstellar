const mongoose = require("mongoose");

const AdminRequestSchema = new mongoose.Schema({
  userId: String,
  name: String,
  pageId: String,
  pageName: String,
});

// compile model from schema
module.exports = mongoose.model("adminRequest", AdminRequestSchema);
