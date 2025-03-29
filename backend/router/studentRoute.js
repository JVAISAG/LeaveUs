const express = require("express");
const Student = require("../models/students");

const router = express.Router();

router.post("/", async (request, response) => {

});

router.get("/login", async (request, response) => {
  try {
    const { RollNo, passwordHash } = request.body;
    const student = await Student.find({
      RollNo,
      passwordHash
    })

    if (student.length !== 1){
      return response.status(400).send("Invalid credentials")
    }

    const studentData = student[0]
    console.log("student login successfully")
    return response.status(200).json({
      message: "student login successfully",
      student: {
        ...studentData._doc
      }
    })

  } catch (error) {
    console.log("Error occured at route GET /login", error.message);
    return response.status(400).send('Something went wrong')
  }
})

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
