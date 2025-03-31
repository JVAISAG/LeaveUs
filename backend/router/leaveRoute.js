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


module.exports = router;
