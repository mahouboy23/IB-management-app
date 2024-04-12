const db = require('../config/database');
const bcrypt = require('bcryptjs');

exports.addUser = async (req, res) => {
    const { username, password, role, full_name } = req.body;
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.execute(`
            INSERT INTO Users (username, password, role, full_name) VALUES (?, ?, ?, ?)
        `, [username, hashedPassword, role, full_name]);

        res.status(201).json({ message: "User added successfully", userId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUsers = async (req, res) => {
    const { search } = req.query;
    try {
        let query = `SELECT * FROM Users`;
        const params = [];
        if (search) {
            query += ` WHERE username LIKE ? OR full_name LIKE ?`;
            params.push(`%${search}%`, `%${search}%`);
        }
        const [users] = await db.execute(query, params);
        res.status(200).json({ message: "Users fetched successfully", users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    const { userId } = req.params;
    const { username, password, role, full_name } = req.body;
    try {
        let updateFields = { username, role, full_name };
        let params = [username, role, full_name, userId]; // Initial params array without password

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields.password = hashedPassword;
            // Insert the hashed password into the params array at the correct position
            params = [username, role, hashedPassword, full_name, userId]; // Include hashedPassword in the correct order
        }

        const query = `
            UPDATE Users 
            SET username = ?, role = ?, ${password ? 'password = ?, ' : ''}full_name = ?
            WHERE user_id = ?
        `;

        const [result] = await db.execute(query, params);

        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'An error occurred while updating the user' });
    }
};

exports.deleteUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const [result] = await db.execute(`
            DELETE FROM Users WHERE user_id = ?
        `, [userId]);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// New method to get all teachers
exports.getAllTeachers = async (req, res) => {
    try {
        const [teachers] = await db.execute(`
            SELECT 
                user_id,
                full_name
            FROM 
                Users
            WHERE 
                role = 'teacher'
        `);
        res.status(200).json({ message: "All teachers fetched successfully", teachers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllStudents = async (req, res) => {
    try {
        const [students] = await db.execute(`
            SELECT 
                user_id,
                full_name
            FROM 
                Users
            WHERE 
                role = 'student'
        `);
        res.status(200).json({ message: "All teachers fetched successfully", students });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// New method to get all coordinators
exports.getAllCoordinators = async (req, res) => {
    try {
        const [coordinators] = await db.execute(`
            SELECT 
                user_id,
                full_name
            FROM 
                Users
            WHERE 
                role = 'coordinator'
        `);
        res.status(200).json({ message: "All coordinators fetched successfully", coordinators });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDashboardOverview = async (req, res) => {
    try {
        // Query to get the total count of users
        const [userCounts] = await db.execute(`
            SELECT role, COUNT(*) as count FROM Users GROUP BY role
        `);
        
        // Query to get the total count of classes
        const [classCount] = await db.execute(`
            SELECT COUNT(*) as count FROM Classes
        `);
        
        // Query to get recent activities (e.g., last 5 added classes)
        const [recentClasses] = await db.execute(`
            SELECT * FROM Classes ORDER BY class_id DESC LIMIT 5
        `);
        
        // Query to get recent grade updates (e.g., last 5 updated grades)
        const [recentGrades] = await db.execute(`
            SELECT g.*, u.full_name, c.class_name 
            FROM Grades g
            JOIN Users u ON g.student_id = u.user_id
            JOIN Classes c ON g.class_id = c.class_id
            ORDER BY g.grade_id DESC LIMIT 5
        `);
        
        res.status(200).json({
            userCounts,
            classCount: classCount[0].count,
            recentClasses,
            recentGrades
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};