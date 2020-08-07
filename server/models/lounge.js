const mongoose = require("mongoose");

const LoungeSchema = new mongoose.Schema({
  name: String, //(ex: "Pset 1 Study Lounge")
  hostId: String,
  userIds: {
    type: [String],
    default: [],
  },
  pageId: String,
  zoomLink: {
    type: String,
    default: "",
  },
});

// compile model from schema
module.exports = mongoose.model("lounge", LoungeSchema);
