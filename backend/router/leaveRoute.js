const express = require("express");
const mongoose = require("mongoose");
const Leave = require("../models/leave");
const Faculty = require("../models/faculty");
const Student = require("../models/students");
const Hostel = require("../models/hostel");

const { ROLE, APPROVAL_STATUS, STATUS } = require("../../constants/approvals");

const router = express.Router();
const approvalOrder = [
  APPROVAL_STATUS.PENDING,
  APPROVAL_STATUS.ADVISOR_APPROVED,
  APPROVAL_STATUS.WARDEN_APPROVED,
  APPROVAL_STATUS.HOD_APPROVED,
  APPROVAL_STATUS.DEAN_APPROVED,
];

const approvalRoles = [ROLE.ADVISOR, ROLE.WARDEN, ROLE.HOD, ROLE.DEAN];

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
};

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
};

router.get("/", async (request, response) => {
  return response.status(200).send("Leave route is working");
});

router.post("/new", async (request, response) => {
  try {
    request.body.startDate = new Date(request.body.startDate);
    request.body.endDate = new Date(request.body.endDate);

    let start = new Date(startDate);
    let end = new Date(endDate);
    let workingDays = 0;

    while (start <= end) {
        let day = start.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        if (day !== 0 && day !== 6) { // Exclude Sundays (0) and Saturdays (6)
            workingDays++;
        }
        start.setDate(start.getDate() + 1); // Move to the next day
    }

    request.body.workingdays = workingDays;
    if (request.body.workingdays < 0) {
      return response.status(400).json({ message: "Invalid date range" });
    }

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


router.get("/all", async (request, response) => {
  try {
    // const leaves = await Leave.find({});
    const leaves = await Leave.aggregate([
      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "_id",
          as: "student",
        },
      },
      {
        $unwind: "$student",
      },
      {
        $project: {
          "student.passwordHash": 0,
          __v: 0,
        }
      }
    ])
    console.log("getting all leaves");
    console.log(leaves);
    return response.status(200).json({
      count: leaves.length,
      data: leaves,
    });
  } catch (error) {
    console.log("Error at GET /leaveform/all", error.message);
    return response.status(400).send("Something went wrong");
  }
});


router.post("/:id/approve", async (request, response) => {
  try {
    const { id } = request.params;
    let { status, facultyId } = request.body;

    facultyId = mongoose.Types.ObjectId.createFromHexString(facultyId);

    if (status === STATUS.REJECTED) {
      return response
        .status(400)
        .json({
          message:
            "Using /approve for rejecting application. Use /reject instead.",
        });
    }

    const leave = await Leave.findById(id);
    if (!leave) {
      return response.status(404).json({ message: "Leave not found" });
    }

    console.log(leave.finalApproval);
    if (leave.finalApproval !== STATUS.PENDING) {
      return response
        .status(400)
        .json({ message: "Leave request already processed" });
    }
    const { nextApproverRole } = leave;

    const faculty = Faculty.findById(facultyId);
    if (!faculty) {
      return response
        .status(403)
        .json({ message: "You are not authorized to approve this leave" });
    }

    if (nextApproverRole === ROLE.ADVISOR) {
      const isValid = await validateAdvisor(facultyId, leave.studentId);
      status = APPROVAL_STATUS.ADVISOR_APPROVED;
      if (!isValid) {
        return response
          .status(403)
          .json({ message: "You are not authorized to approve this leave" });
      }
    } else if (nextApproverRole === ROLE.WARDEN) {
      const isValid = await validateWarden(facultyId, leave.hostelId);
      if (!isValid) {
        return response
          .status(403)
          .json({ message: "You are not authorized to approve this leave" });
      }
      status = APPROVAL_STATUS.WARDEN_APPROVED;
    } else if (nextApproverRole === ROLE.HOD) {
      status = APPROVAL_STATUS.HOD_APPROVED;
    } else if (nextApproverRole === ROLE.DEAN) {
      status = APPROVAL_STATUS.DEAN_APPROVED;
    } else {
      return response
        .status(403)
        .json({ message: "Invalid role provided. Not Authorized." });
    }

    // check if the faculty is the warden of the hostel
    // const hostel = await Hostel.findOne({ _id: leave.hostelId, wardens: facultyId });
    // if (leave.approvalStatus === "WardenApproved" && !hostel) {
    //   return response.status(403).json({ message: "You are not authorized to approve this leave" });
    // }

    // update the approval status
    console.log(status);

    let setQuery = {};
    if (
      (leave.workingdays <= 2 && status == APPROVAL_STATUS.WARDEN_APPROVED) ||
      status === APPROVAL_STATUS.DEAN_APPROVED
    ) {
      setQuery = {
        status: APPROVAL_STATUS.ACCEPTED,
        finalApproval: STATUS.APPROVED,
        nextApproverRole: STATUS.APPROVED,
      };
    } else {
      setQuery = {
        status: status,
        nextApproverRole:
          approvalRoles[approvalRoles.indexOf(nextApproverRole) + 1],
      };
    }

    await Leave.updateOne(
      { _id: leave._id },
      {
        $set: setQuery,
      }
    );

    return response.status(200).json({
      message: "Leave approved successfully",
      leave: leave,
    });
  } catch (error) {
    console.log(
      "Error occurred at leave route POST leaveform/:id/approve",
      error.message
    );
    return response.status(400).send("Something went wrong");
  }
});
router.get("/all", async (request, response) => {
  try {
    const leaves = await Leave.find({});
    console.log("getting all leaves");
    console.log(leaves);
    return response.status(200).json({
      count: leaves.count,
      data: leaves,
    });
  } catch (error) {
    console.log("Error at GET /leaveform/all", error.message);
    return response.status(400).send("Something went wrong");
  }
});


router.post("/:id/reject", async (request, response) => {
  try {
    const { id } = request.params;
    let { status, facultyId } = request.body;

    facultyId = mongoose.Types.ObjectId.createFromHexString(facultyId);

    if (status === STATUS.APPROVED) {
      return response
        .status(400)
        .json({
          message:
            "Using /reject for approving application. Use /approve instead.",
        });
    }

    const leave = await Leave.findById(id);
    if (!leave) {
      return response.status(404).json({ message: "Leave not found" });
    }

    if (leave.finalApproval !== STATUS.PENDING) {
      return response
        .status(400)
        .json({ message: "Leave request already processed" });
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
    console.log(
      "Error occurred at leave route POST leaveform/:id/reject",
      error.message
    );
    return response.status(400).send("Something went wrong");
  }
});

router.post('/:id/delete', async (request, response) => {
  try {
    const { id } = request.params;
    const leave = await Leave.findByIdAndDelete(id);
    if (!leave) {
      return response.status(404).json({ message: "Leave not found" });
    }
    return response.status(200).json({ message: "Leave deleted successfully" });
  } catch (error) {
    console.log("Error occurred at leave route POST leaveform/delete", error.message);
    return response.status(400).send("Something went wrong");
  }
});

module.exports = router;
