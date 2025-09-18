// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Fetch user from db using the ID from the token
            const [rows] = await db.query('SELECT user_id, name, email FROM users WHERE user_id = ?', [decoded.id]);
            
            if (rows.length === 0) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }
            
            req.user = rows[0]; // atach user info to the request
            next();

        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };