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
            type: mongoose.Schema.Types.ObjectId,
            ref: "faculties",  
            required: true
        }
    ],
    chiefWarden: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "faculties",  
        required: true
    }
}, { timestamps: true });  

const Hostel = mongoose.model("Hostel", HostelSchema);
module.exports = Hostel;
