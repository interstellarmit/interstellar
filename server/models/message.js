const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  text: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  userId: String,
  loungeId: String,
});

// compile model from schema
module.exports = mongoose.model("message", MessageSchema);
