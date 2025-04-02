const express = require("express");
const mongoose = require("mongoose");
const Leave = require("../models/leave");
const Faculty = require("../models/faculty");
const Student = require("../models/students");
const Hostel = require("../models/hostel");

const { ROLE, APPROVAL_STATUS, STATUS } = require("../../constants/approvals");

const router = express.Router();
const approvalOrder = [
  "Pending",
  "AdvisorApproved",
  "WardenApproved",
  "HODApproved",
  "DeanApproved",
  "Accepted",
]

const approvalRoles = [
  ROLE.ADVISOR,
  ROLE.WARDEN,
  ROLE.HOD,
  ROLE.DEAN,
]

const validateAdvisor = async (facultyId, studentId) => {
  const advisor = (await Student.findById(studentId)).facultyAdvisor;
  if (!advisor) {
    console.log("Advisor not found for student");
    return false;
  }

  const faculty = await Faculty.findById(facultyId);

  if (!faculty) {
    return false;
  }

  return true;
}

const validateWarden = async (facultyId, hostelId) => {
  const hostel = await Hostel.findById(hostelId);
  if (!hostel) {
    console.log("Hostel not found");
    return false;
  }

  if (!hostel.wardens.includes(facultyId)) {
    console.log("Faculty is not a warden of the hostel");
    return false;
  }

  return true;

}


router.get("/", async (request, response) => {
  return response.status(200).send("Leave route is working");
});

router.post("/new", async (request, response) => {
  try {

    request.body.startDate = new Date(request.body.startDate);
    request.body.endDate = new Date(request.body.endDate);
    request.body.workingdays = Math.ceil((request.body.endDate - request.body.startDate) / (1000 * 60 * 60 * 24)) + 1;

    // const hostelname = request.body.hostelName;

    // const hostel = await Hostel.findOne({ name: hostelname });
    // if (!hostel) {
    //   return response.status(404).json({ message: "Hostel not found" });
    // }

    // request.body.hostelName = hostel._id;

    const leave = new Leave(request.body);

    await leave.save();
    return response.status(201).json({
      message: "Leave request created successfully",
      leave: leave,
    });
  } catch (error) {
    console.log("Error occurred at leave route POST /new", error.message);
    return response.status(400).send("Something went wrong");
  }
});

router.post('/:id/approve', async (request, response) => {
  try {
    const { id } = request.params;
    let { status, facultyId } = request.body;

    facultyId = mongoose.Types.ObjectId.createFromHexString(facultyId);

    
    if (status === STATUS.REJECTED) {
      return response.status(400).json({ message: "Using /approve for rejecting application. Use /reject instead." });
    }
    
    const leave = await Leave.findById(id);
    if (!leave) {
      return response.status(404).json({ message: "Leave not found" });
    }
    
    console.log(leave.finalApproval)
    if (leave.finalApproval !== STATUS.PENDING) {
      return response.status(400).json({ message: "Leave request already processed" });
    }
    const { nextApproverRole } = leave;

    if (nextApproverRole === ROLE.ADVISOR) {
      const isValid = await validateAdvisor(facultyId, leave.studentId);
      status = APPROVAL_STATUS.ADVISOR_APPROVED;
      if (!isValid) {
        return response.status(403).json({ message: "You are not authorized to approve this leave" });
      }
    } 
    else if (nextApproverRole === ROLE.WARDEN) {
      const isValid = await validateWarden(facultyId, leave.hostelId);
      if (!isValid) {
        return response.status(403).json({ message: "You are not authorized to approve this leave" });
      }
      status = APPROVAL_STATUS.WARDEN_APPROVED;
    }

    else {
      return response.status(403).json({ message: "Testing till warden right now" });
    }
      

    // check if the faculty is the warden of the hostel
    // const hostel = await Hostel.findOne({ _id: leave.hostelId, wardens: facultyId });
    // if (leave.approvalStatus === "WardenApproved" && !hostel) {
    //   return response.status(403).json({ message: "You are not authorized to approve this leave" });
    // }

    // update the approval status
    console.log(status);
    await Leave.updateOne(
      { _id: leave._id },
      {
        $set: {
          status: status,
          nextApproverRole: approvalRoles[approvalRoles.indexOf(nextApproverRole) + 1],
        },
      }
    );

    return response.status(200).json({
      message: "Leave approved successfully",
      leave: leave,
    });
  } catch (error) {
    console.log("Error occurred at leave route POST leaveform/:id/approve", error.message);
    return response.status(400).send("Something went wrong");
  }
});


router.post('/:id/reject', async (request, response) => {
  try {
    const { id } = request.params;
    let { status, facultyId } = request.body;

    facultyId = mongoose.Types.ObjectId.createFromHexString(facultyId);

    if (status === STATUS.APPROVED) {
      return response.status(400).json({ message: "Using /reject for approving application. Use /approve instead." });
    }

    const leave = await Leave.findById(id);
    if (!leave) {
      return response.status(404).json({ message: "Leave not found" });
    }

    if (leave.finalApproval !== STATUS.PENDING) {
      return response.status(400).json({ message: "Leave request already processed" });
    }

    await Leave.updateOne(
      { _id: leave._id },
      {
        $set: {
          status: APPROVAL_STATUS.REJECTED,
          finalApproval: STATUS.REJECTED,
          nextApproverRole: null,
        },
      }
    );

    return response.status(200).json({
      message: "Leave rejected successfully",
      leave: leave,
    });
  } catch (error) {
    console.log("Error occurred at leave route POST leaveform/:id/reject", error.message);
    return response.status(400).send("Something went wrong");
    
  }
});


module.exports = router;
