const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  nameAndLastName: { type: String, required: true },
  address: { type: String },
  description: { type: String },
});

module.exports = mongoose.model("User", userSchema);
