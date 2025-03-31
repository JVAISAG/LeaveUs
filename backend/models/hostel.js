const mongoose = require("mongoose");

const HostelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    wardens: [
      {
        warden: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "faculties",
        },
        // required: true,
      },
    ],
    chiefWarden: {
      type: String,
      required: true,
      trim: true,
    },
  },
);

const Hostel = mongoose.model("hostels", HostelSchema);
module.exports = Hostel;
