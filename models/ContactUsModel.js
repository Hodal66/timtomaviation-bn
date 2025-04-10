const mongoose = require("mongoose");

const contactUsSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  telephone: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("ContactUs", contactUsSchema);
