const express = require("express");
const mongoose = require("mongoose")
const Student = require("../models/students");
const Leave = require("../models/leave");
const { APPROVAL_STATUS } = require("../../constants/approvals");

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
    let { id } = request.params;

    const student = Student.findById(id);
    if (!student) {
      return response.status(404).json({ message: "Student not found" });
    }

    const leaves = await Leave.aggregate([
      {
        $match: { studentId: new mongoose.Types.ObjectId(id) },
      },
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
        },
      },
    ])

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

    if (leave.studentId.toString() !== id) {
      return response.status(403).json({ message: "Not the owner of the leaveform" });
    }

    if (leave.status !== APPROVAL_STATUS.PENDING) {
      return response.status(403).json({ message: "Leave is already in processing phase" });
    }

    // allowed fields to update
    const allowedFields = [
      "reason",
      "startDate",
      "endDate",
      "leaveType"
    ];

    const invalidFields = Object.keys(request.body).filter(
      (field) => !allowedFields.includes(field)
    );
    if (invalidFields.length > 0) {
      return response.status(400).json({
        message: `You are not allowed to update these fields: ${invalidFields.join(", ")}`,
      });
    }


    if (request.body.startDate) request.body.startDate = new Date(request.body.startDate);
    if (request.body.endDate) request.body.endDate = new Date(request.body.endDate);

    const workingDays = request.body.endDate - request.body.startDate;
    if (workingDays < 0) {
      return response.status(400).json({ message: "Invalid date range" });
    }
    request.body.workingdays = Math.ceil(workingDays / (1000 * 60 * 60 * 24)) + 1;

    console.log(request.body)
    const newleave = await Leave.updateOne(
      { _id: leave._id },
      {
        $set: {
          ...request.body,
        },
      }
    );

    if (newleave.matchedCount === 0) {
      return response.status(400).json({ message: "Leave not updated"});
    }

    return response.status(200).json({
      message: "Leave updated successfully",
    });

  } catch (error) {
    console.log(
      "Error occurred at student route POST /leaves/:id/edit/:leaveId",
      error.message
    );
    return response.status(400).send("Something went wrong");
  }
});

router.post('/:id/delete', async (request, response) => {
  try {
    const { id } = request.params;

    const student = await Student.findByIdAndDelete(id);
    if (!res) {
      return response.status(404).json({ message: "Student not found" });
    }

    return response.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.log("Error occurred at leave route POST student/delete", error.message);
    return response.status(400).send("Something went wrong");
  }
  
})

router.post('/new', async (request, response) => {
  try {
    const student = new Student(request.body);
    await student.save();
    return response.status(201).json({
      message: "Student created successfully",
      student: student,
    });
  } catch (error) {
    console.log("Error occurred at student route POST /new", error.message);
    return response.status(400).send("Something went wrong");
  }
})

module.exports = router;
