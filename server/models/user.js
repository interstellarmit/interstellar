const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  classYear: Number,
  accessToken: String,
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  isVerified: {
    type: Boolean,
    default: false,
  },
  pageIds: {
    type: [{ pageId: String, semester: String }],
    default: [],
  },
  visible: {
    type: Boolean,
    default: true,
  },
  profileVisible: {
    type: Boolean,
    default: true,
  },
  seeHelpText: {
    type: Boolean,
    default: true,
  },
  isSiteAdmin: {
    type: Boolean,
    default: false,
  },
  signedContract: {
    type: Boolean,
    default: false,
  },
  hometown: {
    type: String,
    default: "",
  },
  curLoc: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  activities: {
    type: String,
    default: "",
  },
  restaurant: {
    type: String,
    default: "",
  },
  advice: {
    type: String,
    default: "",
  },
  funFact: {
    type: String,
    default: "",
  },
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
