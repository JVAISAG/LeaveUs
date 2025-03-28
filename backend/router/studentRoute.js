const express = require("express");
const Student = require("../models/students");

const router = express.Router();

router.post("/", async (request, response) => {});

router.get("/", async (request, response) => {
  return response.status(200).send("student route is working");
});

router.get("/all", async (request, response) => {
  try {
    const students = await Student.find({});
    console.log("getting all students");
    console.log(students)
    return response.status(200).json({
      count: students.count,
      data: students,
    });
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
