const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
  pageType: String, // (ex: either "Class" or "Group"),
  name: String, // (ex: "6.033" or "ZBT"),
  title: String, // (ex: "Computer Systems" or "Zeta Beta Tau"),
  numPeople: {
    type: Number,
    default: 0,
  },
  inviteCode: String,
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
  is_historical: Boolean,
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
  adminIds: [String],
  lastUpdated: {
    type: String,
    default: 'spring-2021',
  },
});

// compile model from schema
module.exports = mongoose.model('page', PageSchema);
