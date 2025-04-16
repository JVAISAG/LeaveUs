const Hostel = require("../models/hostel");
const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    return res.status(200).json({ message: "Hostel route is working" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const hostels = await Hostel.find({});
    return res.status(200).json(hostels);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/new", async (req, res) => {
  try {
    const hostel = new Hostel(req.body);
    await hostel.save();
    return res.status(201).json(hostel);
  } catch (error) {
    console.error("Error creating new hostel:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/:hostelId/add-warden/:wardenId", async (req, res) => {
  const { hostelId, wardenId, isChiefWarden } = req.params;
  try {
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    if (isChiefWarden) {
      Hostel.updateOne(
        {
          _id: hostelId,
        },
        {
          $set: { chiefWarden: wardenId },
        }
      );
    } else {
      const existingWarden = hostel.wardens.find(
        (warden) => warden._id === wardenId
      );
      if (existingWarden) {
        return res
          .status(200)
          .json({ message: "Hostel already has this warden" });
      }
      Hostel.updateOne(
        {
          _id: hostelId,
        },
        {
          $push: { wardens: wardenId },
        }
      );
    }

    await hostel.save();
    return res.status(200).json(hostel);
  } catch (error) {
    console.error("Error adding warden to hostel:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
