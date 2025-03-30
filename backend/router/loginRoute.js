const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/students"); 
const Faculty = require("../models/faculty");  

const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = null;
        let userType = "";

        user = await Student.findOne({ email });
        if (user) userType = "student";

        if (!user) {
            user = await Faculty.findOne({ email });
            if (user) userType = "faculty";
        }

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, role: userType },
            process.env.JWT_SECRET, 
            { expiresIn: "1h" } 
        );

        res.status(200).json({ message: "Login successful", token, role: userType });
        
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
