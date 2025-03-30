const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization"); // Get token from request header

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = decoded; // Attach user data to request object
        next(); // Continue to next middleware/route
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token." });
    }
};

module.exports = authMiddleware;
