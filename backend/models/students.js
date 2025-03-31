const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  rollNo: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  parentPhone: { type: String, required: true },
  parentEmail: { type: String, required: true },
  contactNumber: { type: String, required: true },
  HostelName : { type: mongoose.Schema.Types.ObjectId, ref: "hostels"  },
  RoomNo: { type: String, required: true },
  facultyAdvisor: { type: mongoose.Schema.Types.ObjectId, ref: "faculties" },
});

module.exports = mongoose.model("students", studentSchema);
