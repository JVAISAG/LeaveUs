const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true, enum: ["Advisor", "HOD", "Warden"] },
});

module.exports = mongoose.model("Faculty", facultySchema);
