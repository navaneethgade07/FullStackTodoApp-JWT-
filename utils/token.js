require('dotenv').config();
const jwt = require('jsonwebtoken');

let jwtsecretKey = process.env.JWT_SECRET_KEY;

const createToken = (id) => {
    return jwt.sign({ id }, jwtsecretKey, {
        expiresIn: 3 * 24 * 60 * 60,
    });
}

// verifying the generated token
const validateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized' })
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ success: false, message: 'Invalid token' });
    
        req.user = user;
        next();
    });
}

module.exports = { createToken, validateToken };