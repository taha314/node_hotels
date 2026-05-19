const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {

    // first check request header has authorization or not
     const authorization = req.headers.authorization
        if (!authorization) {
            return res.status(401).json({ error: 'Token not found' });
        }

    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from "Bearer <token>"

    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        // veryfy jwt token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Invalid token' });
    }
}

// function to generate jwt token
const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1h' });
}

module.exports = { generateToken, jwtAuthMiddleware }; // Export generateToken and jwtAuthMiddleware;