const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  email: String,
  password: String,
  pageIds: [String],
  visible: {
      type: Boolean, 
      default: true
  },
  isSiteAdmin: {
    type: Boolean,
    default: false
  },
  loungeId: String  // blank indicates not in lounge

});

// compile model from schema
module.exports = mongoose.model("comment", CommentSchema);
