const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const db = require('../config/database');
require('dotenv').config();

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    
    try {
        const [user] = await db.execute('SELECT * FROM Users WHERE username = ?', [username]);

        if (user.length > 0) {
            const isValid = await bcrypt.compare(password, user[0].password);

            if (isValid) {
                if (!process.env.JWT_SECRET) {
                  throw new Error('JWT_SECRET is not defined');
                }
                const token = jwt.sign(
                  { userId: user[0].user_id, role: user[0].role, fullName: user[0].full_name },
                  process.env.JWT_SECRET,
                  { expiresIn: '1h' }
                );
                
                return res.json({ message: "Login successful", token });
              }
        }

        res.status(401).json({ message: "Authentication failed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllStudents = async (req, res) => {
    try {
        const [students] = await db.execute('SELECT * FROM Users WHERE role = "student"');

        if (students.length > 0) {
            return res.status(200).json({ message: "Students fetched successfully", students });
        } else {
            return res.status(404).json({ message: "No students found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
