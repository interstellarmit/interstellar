const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  schoolId: String,
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
  loungeId: {
    type: String, // blank indicates not in lounge
    default: "",
  },
  signedContract: {
    type: Boolean,
    default: false,
  },
  hometown: {
    type: String,
    default: "Add a hometown!"
  },
  curLoc: {
    type: String,
    default: "Add a location/dorm!"
  },
  bio: {
    type: String,
    default: "Add a bio!"
  },
  restaurant: {
    type: String,
    default: "Add a favorite restaurant!"
  },
  advice: {
    type: String,
    default: "Add something!"
  },
  funFact: {
    type: String,
    default: "Add a fun fact!"
  }
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
