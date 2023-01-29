const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
  link: String,
});

module.exports = mongoose.model('link', LinkSchema);
