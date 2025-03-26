const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  rollNo: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  parentPhone: { type: String, required: true },
  parentEmail: { type: String, required: true },
  contactNumber: { type: String, required: true },
  HostelName : { type: String, required: true },
  facultyIncharge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
    required: true,
  },
});

module.exports = mongoose.model("Student", studentSchema);
