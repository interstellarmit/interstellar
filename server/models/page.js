const mongoose = require("mongoose");

const PageSchema = new mongoose.Schema({
  pageType: String, // (ex: either "Class" or "Group"),
  name: String, // (ex: "6.033" or "ZBT"),
  title: String, // (ex: "Computer Systems" or "Zeta Beta Tau"),
  numPeople: {
    type: Number,
    default: 0,
  },
  professor: String,
  rating: Number,
  in_class_hours: Number,
  out_of_class_hours: Number,
  total_units: Number,
  description: String,
  offered_fall: Boolean,
  offered_spring: Boolean,
  offered_IAP: Boolean,
  offered_summer: Boolean,
  has_final: Boolean,
  joint_subjects: {
    type: [String],
    default: [],
  },
  meets_with_subjects: {
    type: [String],
    default: [],
  },
  related_subjects: {
    type: [String],
    default: [],
  },
  url: String,
  schedule: String,
  not_offered_year: String,
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
});

// compile model from schema
module.exports = mongoose.model("page", PageSchema);
