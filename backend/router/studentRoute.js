const express = require("express");
const Student = require("../models/students");
const Leave = require("../models/leave");

const router = express.Router();

router.post("/", async (request, response) => {});

router.get("/login", async (request, response) => {
  try {
    const { RollNo, passwordHash } = request.body;
    const student = await Student.find({
      RollNo,
      passwordHash,
    });

    if (student.length !== 1) {
      return response.status(400).send("Invalid credentials");
    }

    const studentData = student[0];
    console.log("student login successfully");
    return response.status(200).json({
      message: "student login successfully",
      student: {
        ...studentData._doc,
      },
    });
  } catch (error) {
    console.log("Error occured at student route GET /login", error.message);
    return response.status(400).send("Something went wrong");
  }
});

router.get("/", async (request, response) => {
  return response.status(200).send("student route is working");
});

router.get("/all", async (request, response) => {
  try {
    const students = await Student.find({});
    console.log("getting all students");
    console.log(students);
    return response.status(200).json({
      count: students.count,
      data: students,
    });
  } catch (error) {
    console.log("Error at GET /student/all", error.message);
    return response.status(400).send("Something went wrong");
  }
});

router.get("/:id", async (request, response) => {
  try {
    const student = await Student.findById(request.params.id);
    if (!student) {
      return response.status(404).json({ message: "Student not found" });
    }
    return response.status(200).json(student);
  } catch (error) {
    return response.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id/leaveforms", async (request, response) => {
  try {
    const { id } = request.params;

    const student = Student.findById(id);
    if (!student) {
      return response.status(404).json({ message: "Student not found" });
    }

    const leaves = await Leave.find({ studentId: id });
    return response.status(200).json({
      message: "Leaves fetched successfully",
      leaves: leaves,
    });
  } catch (error) {
    console.log(
      "Error occurred at student route GET /leaves/:id",
      error.message
    );
    return response.status(400).send("Something went wrong");
  }
});

router.post("/:id/leaveform/edit/:leaveId", async (request, response) => {
  try {
    const { id, leaveId } = request.params;
    const leave = await Leave.findById(leaveId);
    if (!leave) {
      return response.status(404).json({ message: "Leave not found" });
    }

    const student = await Student.findById(id);
    if (!student) {
      return response.status(404).json({ message: "Student not found" });
    }

    Leave.updateOne({ _id: leaveId }, { $set: request.body }, (err, result) => {
      if (err) {
        return response.status(500).json({ message: "Error updating leave" });
      }
    });

    return response.status(200).json({
      message: "Leave updated successfully",
      leave: leave,
    });
  } catch (error) {
    console.log(
      "Error occurred at student route POST /leaves/:id/edit/:leaveId",
      error.message
    );
    return response.status(400).send("Something went wrong");
  }
});

module.exports = router;
