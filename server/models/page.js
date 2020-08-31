const mongoose = require("mongoose");

const PageSchema = new mongoose.Schema({
  pageType: String, // (ex: either "Class" or "Group"),
  name: String, // (ex: "6.033" or "ZBT"),
  title: {
    // (ex: "Computer Systems" or "Zeta Beta Tau"),
    type: String,
    default: "",
  },
  schoolId: String,
  professor: {
    type: String,
    default: "",
  },
  rating: {
    type: Number,
    default: 0,
  },
  hours: {
    type: Number,
    default: 0,
  },
  units: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    default: "",
  },
  expiryDate: {
    type: Date,
    default: new Date(2085, 11, 24),
  },
  adminIds: [String],
  locked: {
    type: Boolean,
    default: false,
  },
  joinCode: {
    type: String,
    default: "",
  },
  showClasses: {
    type: Boolean,
    default: true,
  },
  sameAs: {
    type: String,
    default: ""
  }
});

// compile model from schema
module.exports = mongoose.model("page", PageSchema);
