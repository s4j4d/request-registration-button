const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  phoneNumber: { type: String, required: true },
  nameAndLastName: { type: String, required: true },
  address: { type: String },
  description: { type: String },
  appointmentDate: { type: Date },
});

module.exports = mongoose.model("User", userSchema);
