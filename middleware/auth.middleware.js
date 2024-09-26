const jwt = require('jsonwebtoken');

// Middleware to check for a valid token
const authMiddleware = (req, res, next) => {
    // Get the token from the Authorization header
    const token = req.headers['authorization']?.split(' ')[1]; // Format: "Bearer <token>"

    if (!token) {
        return res.status(403).json({ status: false, message: 'Token is required for authentication' });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ status: false, message: 'Invalid token' });
        }
        req.user = user; // Save user information to request for further use
        next(); // Proceed to the next middleware/route handler
    });
};

module.exports = authMiddleware;
