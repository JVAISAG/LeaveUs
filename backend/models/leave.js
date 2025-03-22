const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  leaveId: { type: Number, required: true, unique: true },
  rollNo: { type: Number, required: true, ref: "Student" },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["Pending", "AdvisorApproved", "WardenApproved", "Rejected"],
    default: "Pending",
  },
  approvals: [
    {
      approverId: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
      status: {
        type: String,
        required: true,
        enum: ["Pending", "Approved", "Rejected"],
      },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  advisorApproval: { type: Boolean, default: false },
  wardenApproval: { type: Boolean, default: false },
  hodApproval: { type: Boolean, default: false },
  deanApproval: { type: Boolean, default: false },
  MoreThan2days: { type: Boolean, default: false },
});

module.exports = mongoose.model("Leave", leaveSchema);
