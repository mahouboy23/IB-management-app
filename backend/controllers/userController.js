const db = require('../config/database');

exports.addUser = async (req, res) => {
    const { username, password, role, full_name } = req.body;
    try {
        const [result] = await db.execute(`
            INSERT INTO Users (username, password, role, full_name) VALUES (?, ?, ?, ?)
        `, [username, password, role, full_name]); // Remember to hash the password in a real application
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
        const [result] = await db.execute(`
            UPDATE Users SET username = ?, password = ?, role = ?, full_name = ? WHERE user_id = ?
        `, [username, password, role, full_name, userId]); // Remember to hash the password in a real application
        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
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