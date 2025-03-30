const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  rollNo: { type: String, required: true, ref: "student" },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "student" },
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: "hostel" },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  workingdays: { type: Number, required: true }, // User inputs number of working days

  status: {
    type: String,
    required: true,
    enum: [
      "Pending",
      "AdvisorApproved",
      "WardenApproved",
      "HODApproved",
      "DeanApproved",
      "Rejected",
    ],
    default: "Pending",
  },

  finalApproval: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },

  nextApproverRole: "Advisor",

  approvals: [
    {
      approverId: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
      role: {
        type: String,
        enum: ["Advisor", "Warden", "HOD", "Dean"],
        required: true,
      },
      status: {
        type: String,
        required: true,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
      },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("leaves", leaveSchema);
