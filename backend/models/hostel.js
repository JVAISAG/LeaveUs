const mongoose = require("mongoose");

const HostelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,  
        trim: true
    },
    wardens: [
        {
            type: String,
            required: true,
            trim: true
        }
    ],
    chiefWarden: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });  

const Hostel = mongoose.model("hostels", HostelSchema);
module.exports = Hostel;
