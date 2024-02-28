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

exports.getGradesByStudent = async (req, res) => {
    const { studentId } = req.params;
    try {
        const [grades] = await db.execute(`
            SELECT 
                g.grade_id,
                u.full_name AS student_name, 
                u.level,
                c.class_name,
                c.subject,
                g.grade_value,
                g.trimester
            FROM 
                Grades g
            JOIN 
                Users u ON g.student_id = u.user_id
            JOIN 
                Classes c ON g.class_id = c.class_id
            WHERE 
                g.student_id = ?`, 
            [studentId]
        );
        res.status(200).json({ message: "Grades fetched successfully", grades });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



exports.updateGrade = async (req, res) => {
    const { gradeId } = req.params; 
    const { gradeValue, trimester } = req.body;
    try {
        const [result] = await db.execute(
            `UPDATE Grades SET grade_value = ?, trimester = ? WHERE grade_id = ?`,
            [gradeValue, trimester, gradeId]
        );
        if (result.affectedRows) {
            res.status(200).json({ message: "Grade updated successfully" });
        } else {
            res.status(404).json({ message: "Grade not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteGrade = async (req, res) => {
    const { gradeId } = req.params; // Assuming gradeId is passed as a URL parameter
    try {
        const [result] = await db.execute(
            `DELETE FROM Grades WHERE grade_id = ?`,
            [gradeId]
        );
        if (result.affectedRows) {
            res.status(200).json({ message: "Grade deleted successfully" });
        } else {
            res.status(404).json({ message: "Grade not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
