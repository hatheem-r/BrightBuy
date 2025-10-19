// backend/controllers/staffController.js
const pool = require('../config/db'); // Correct path to your db.js
const bcrypt = require('bcryptjs');

// Controller function to handle adding a new staff member
exports.addStaff = async (req, res) => {
    const { name, email, password, role } = req.body;

    // 1. Basic Validation
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }
    
    // Simple email format check (optional but recommended)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
    }

    try {
        // 2. Hash the Password (security step)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Prepare and Execute SQL Query
        const [result] = await pool.execute(
            `INSERT INTO staff (name, email, password, role) VALUES (?, ?, ?, ?)`,
            [name, email, hashedPassword, role]
        );

        // 4. Success Response
        return res.status(201).json({
            message: 'Staff member created successfully!',
            staffId: result.insertId,
            name: name
        });

    } catch (error) {
        // Check for MySQL Duplicate Entry error (error code 1062)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Registration failed: Email already in use.' });
        }
        
        console.error('Database Error in addStaff:', error);
        return res.status(500).json({ message: 'Internal Server Error.' });
    }
};

// backend/controllers/staffController.js (Add this new function)
// ... existing imports and addStaff function ...

// Controller function to handle fetching all staff members
exports.getAllStaff = async (req, res) => {
    try {
        // NOTE: We do NOT select the 'password' field for security reasons
        const [staff] = await pool.execute(
            `SELECT id, name, email, role, created_at FROM staff ORDER BY created_at DESC`
        );

        // Success response
        return res.status(200).json({ 
            message: 'Staff list retrieved successfully',
            staff: staff 
        });

    } catch (error) {
        console.error('Database Error in getAllStaff:', error);
        return res.status(500).json({ message: 'Internal Server Error while fetching staff.' });
    }
};