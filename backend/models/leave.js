const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "students" },
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: "hostels" },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  reason: { 
    type: String, 
    // required: true 
  },
  leaveType: {
    type: String,
    enum: ["medical", "general", "duty"],
    required: true
  },
  workingdays: { 
    type: Number, 
    required: true 
  }, // User inputs number of working days

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

  nextApproverRole: {
    type: String,
    enum: ["Advisor", "Warden", "HOD", "Dean"],
    default: "Advisor",
  },

  approvals: [
    {
      approverId: { type: mongoose.Schema.Types.ObjectId, ref: "faculties" },
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

  ReasonFA : {type: String, default: "No Reason Provided"},
});

module.exports = mongoose.model("leaves", leaveSchema);
