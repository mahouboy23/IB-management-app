const db = require('../config/database');

exports.addGrade = async (req, res) => {
    const { studentId, classId, gradeValue, trimester } = req.body;
    try {
        const [result] = await db.execute(
            `INSERT INTO Grades (student_id, class_id, grade_value, trimester) VALUES (?, ?, ?, ?)`,
            [studentId, classId, gradeValue, trimester]
        );
        res.status(201).json({ message: "Grade added successfully", gradeId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
