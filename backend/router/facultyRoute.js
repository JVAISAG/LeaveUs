const Faculty = require('../models/faculty');
const Leave = require('../models/leave');
const Student = require('../models/students');
const Hostel = require('../models/hostel');
const express = require('express');
const { APPROVAL_STATUS } = require('../../constants/approvals');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    return res.status(200).json({ message: 'Faculty route is working' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const hostels = await Faculty.find({});
    return res.status(200).json(hostels);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id', async (request, response) => {
  try {
    const faculty = await Faculty.findById(request.params.id);
    if (!faculty) {
      return response.status(404).json({ message: 'Faculty not found' });
    }
    return response.status(200).json(faculty);
  } catch (error) {
    return response.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id/leaveforms', async (request, response) => {
  try {
    const { id } = request.params;

    // get the hostel of the faculty
    const faculty = await Faculty.findById(id);
    if (!faculty) {
      return response.status(404).json({ message: "Faculty not found" });
    }

    // take the leaves for the faculty who is the advisor to other students
    const students = (await Student.find({
      facultyAdvisor: id,
    })).map(student => student._id);



    // hostel stores the various faculty in a list 
    // check each hostel record to know which faculty is the warden of the hostel
    const hostels = (await Hostel.find({
      wardens: { $in: [id] }
    })).map(hostel => hostel._id);

    if (hostels.length === 0) {
      console.log("No hostels found for this faculty");
    }

    // for each hostel in the hostels list, get the array of leaves with the hostel id
    const queryConditions = [
      { studentId: { $in: students }, status: APPROVAL_STATUS.PENDING },
      { hostelId: { $in: hostels }, status: APPROVAL_STATUS.ADVISOR_APPROVED }
    ]

    if (faculty.isHOD){
      queryConditions.push({ 
        status: APPROVAL_STATUS.WARDEN_APPROVED ,
        workingdays: { $gt: 2 },
      });
    }

    if (faculty.isDean){
      queryConditions.push({ 
        status: APPROVAL_STATUS.HOD_APPROVED ,
        workingdays: { $gt: 2 },
      });
    }

    const leaves = await Leave.find({
      $or: queryConditions,
    });


    return response.status(200).json({
      message: "Leaves fetched successfully",
      leaves: leaves,
    });

  } catch (error) {
    console.log("Error occurred at leave route GET /leaves/:id", error.message);
    return response.status(400).send("Something went wrong");
  }
});

module.exports = router;