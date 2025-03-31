const express = require("express");
const mongoose = require("mongoose");
const Leave = require("../models/leave");
const Faculty = require("../models/faculty");
const Student = require("../models/students");
const Hostel = require("../models/hostel");

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
  "Advisor",
  "Warden",
  "HOD",
  "Dean",
]

const validateAdvisor = async (facultyId, studentId) => {
  const advisor = (Student.findById(studentId)).facultyAdvisor;
  if (!advisor) {
    throw new Error("Advisor not found for this student");
  }

  const faculty = await Faculty.findById({
    _id: facultyId,
    role: "Advisor",
  });
  if (!faculty) {
    throw new Error("Faculty not found");
  }

  return faculty._id.toString() === advisor.toString();
}


router.get("/", async (request, response) => {
  return response.status(200).send("Leave route is working");
});

router.post("/new", async (request, response) => {
  try {

    request.body.startDate = new Date(request.body.startDate);
    request.body.endDate = new Date(request.body.endDate);
    request.body.workingdays = Math.ceil((request.body.endDate - request.body.startDate) / (1000 * 60 * 60 * 24)) + 1;

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

router.post('/approve/:leaveId', async (request, response) => {
  try {
    const { leaveId } = request.params;
    const { approverId, role, status } = request.body;

    const leave = await Leave.findById(leaveId);
    if (!leave) {
      return response.status(404).json({ message: "Leave not found" });
    }

    if (status !== "Approved"){
      return response.status(400).json({ message: "You are using /approve for rejecting the application" });
    }

    if (leave.nextApproverRole !== role){
      return response.status(400).json({ message: "Invalid role to accept application" });
    }

    if (leave.status !== "Pending") {
      return response.status(400).json({ message: "Leave request has already been processed" });
    }

    // check if a valid faculty is approving the leave
    const approver = Faculty.find({
      _id: approverId,
      role: role,
    })

    if (approver !== 1) {
      return response.status(400).json({ message: "You are not authorized to approve this leave" });
    }


    // validate based on role
    let isValid = false;
    switch (role){
      case "Advisor":
        isValid = await validateAdvisor(approverId);
        break;
      case "Warden":
        isValid = await validateWarden(approverId);
        break;
      case "HOD":
        isValid = await validateHOD(approverId);
        break;
      case "Dean":
        isValid = await validateDean(approverId);
        break;
      default:
        isValid = false;
        break;
    }

    if (!isValid) {
      return response.status(400).json({ message: "You did not pass validation to approve leave. Please try again with valid credentials." });
    }
    

    // set the leave status to the next status in the approval order
    const nextStatus = approvalOrder[approvalOrder.indexOf(leave.status) + 1];

    if (nextStatus === "Accepted"){
      leave.status = nextStatus;
      leave.finalApproval = nextStatus;
      return response.status(200).json({
        message: "Leave request accepted successfully",
        leave: leave,
      });
    }

    const nextApproverRole = approvalRoles[approvalRoles.indexOf(role) + 1];
    leave.nextApproverRole = nextApproverRole;

    await leave.save();

    return response.status(200).json({
      message: "Leave request updated successfully",
      leave: leave,
    });

  } catch (error) {
    console.log("Error occurred at leave route POST /approve/:leaveId", error.message);
    return response.status(400).send("Something went wrong");
  }
})

router.get('/leaves/:facultyid', async (request, response) => {
  try {
    const { facultyid } = request.params;

    // get the hostel of the faculty
    const faculty = await Faculty.findById(facultyid);
    if (!faculty) {
      return response.status(404).json({ message: "Faculty not found" });
    }

    // take the leaves for the faculty who is the advisor to other students
    const students = (await Student.find({
      facultyAdvisor: facultyid,
    })).map(student => student._id);



    // hostel stores the various faculty in a list 
    // check each hostel record to know which faculty is the warden of the hostel
    const hostels = (await Hostel.find({
      wardens: { $in: [wardenId] }
    })).map(hostel => hostel._id);

    if (hostels.length === 0) {
      console.log("No hostels found for this faculty");
    }

    // for each hostel in the hostels list, get the array of leaves with the hostel id
    const leaves = await Leave.find({
      $or: [
        { studentId: { $in: students } },
        { hostelId: { $in: hostels } },
      ]
    });

    return response.status(200).json({
      message: "Leaves fetched successfully",
      leaves: leaves,
    });

  } catch (error) {
    console.log("Error occurred at leave route GET /leaves/:facultyid", error.message);
    return response.status(400).send("Something went wrong");
  }
});


module.exports = router;
