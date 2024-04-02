const db = require('../config/database');

exports.addGrade = async (req, res) => {
    const { studentId, classId, gradeValue, totalValue, trimester, date } = req.body;
    console.log('studentId:', studentId); // Log each variable
    console.log('classId:', classId);
    console.log('gradeValue:', gradeValue);
    console.log('totalValue:', totalValue);
    console.log('trimester:', trimester);
    try {
        // Fetch grade boundaries for the class and totalValue
        const [boundaries] = await db.execute(`
            SELECT * FROM GradeBoundaries 
            WHERE class_id = ? AND over_value = ?
        `, [classId, totalValue]);

        let convertedGrade = gradeValue;
        let warningMsg = ''; // Declare warningMsg variable and initialize it with an empty string
        if (boundaries.length) {
            // Parse the JSON string to get the array of grade boundaries
            const gradeBoundaries = JSON.parse(boundaries[0].grades);

            // Convert gradeValue to IB scale based on boundaries
            let isConverted = false;
            for (let boundary of gradeBoundaries) {
                const min = Number(boundary.min);
                const max = Number(boundary.max);
                if (gradeValue >= min && gradeValue <= max) {
                    convertedGrade = boundary.ib_grade;
                    isConverted = true;
                    break;
                }
            }
            // If grade does not fit any boundary, you might want to handle it differently
            if (!isConverted) {
                warningMsg = "Grade does not fit any predefined boundary. Consider reviewing your boundaries.";
            } else if (boundaries.length === 0) {
                warningMsg = "No grade boundaries set for this class and total value. Performing automatic conversion.";
            }
        } else {
            // Warn about missing boundaries and perform automatic conversion
            convertedGrade = Math.ceil((gradeValue / totalValue) * 7);
            console.warn("No grade boundaries set for this class and total value. Performing automatic conversion.");
        }
        const today = new Date();
        const formattedDate = today.toISOString().slice(0, 10); // Format the date as 'YYYY-MM-DD'

        console.log('Parameters:', [studentId, classId, convertedGrade, totalValue, trimester, formattedDate]);
        // Insert the converted grade and today's date into the database
        const [result] = await db.execute(
            `INSERT INTO Grades (student_id, class_id, grade_value, total_value, trimester, date) VALUES (?, ?, ?, ?, ?, ?)`,
            [studentId, classId, convertedGrade, totalValue, trimester, formattedDate]
        );
        res.status(201).json({ message: "Grade added successfully", warningMessage: warningMsg, gradeId: result.insertId });
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
                g.grade_value,
                g.trimester
                c.subject
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

exports.getGradesByFilter = async (req, res) => {
    const { studentId, classId, trimester } = req.params;
    try {
        let query = `
        SELECT 
        g.grade_id,
        g.grade_value,
        g.total_value,
        g.trimester,
        c.class_name,
        c.subject,
        u.full_name AS student_name,
        g.date,
        CASE
            WHEN g.grade_value >= 0.8 * g.total_value THEN 'High'
            WHEN g.grade_value >= 0.6 * g.total_value THEN 'Medium'
            ELSE 'Low'
        END AS level
    FROM 
        Grades g
    JOIN
        Classes c ON g.class_id = c.class_id
    JOIN
        Users u ON g.student_id = u.user_id
    WHERE 1=1
`;

        const params = [];

        if (studentId && studentId !== '0') {
            query += ` AND g.student_id = ?`;
            params.push(studentId);
        }

        if (classId) {
            query += ` AND g.class_id = ?`;
            params.push(classId);
        }

        if (trimester) {
            query += ` AND g.trimester = ?`;
            params.push(trimester);
        }

        const [grades] = await db.execute(query, params);
        res.status(200).json({ message: "Grades fetched successfully", grades });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getGradesByClass = async (req, res) => {
    const { classId } = req.params;
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
                g.class_id = ?`, 
            [classId]
        );
        res.status(200).json({ message: "Grades fetched successfully", grades });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getFilteredGrades = async (req, res) => {
    // Use req.params to access route parameters
    const studentId = parseInt(req.params.studentId, 10);
    const classId = parseInt(req.params.classId, 10);
    const trimester = parseInt(req.params.trimester, 10);

    let query = `
      SELECT 
        g.grade_id,
        u.full_name AS student_name, 
        c.class_name,
        g.grade_value,
        g.trimester,
        DATE_FORMAT(g.date, '%Y-%m-%d') AS date
      FROM 
        Grades g
      JOIN 
        Users u ON g.student_id = u.user_id
      JOIN 
        Classes c ON g.class_id = c.class_id
      WHERE 1=1
    `;
    const params = [];
    
    if (!isNaN(studentId)) {
      query += ` AND g.student_id = ?`;
      params.push(studentId);
    }
    if (!isNaN(classId)) {
      query += ` AND g.class_id = ?`;
      params.push(classId);
    }
    if (!isNaN(trimester)) {
      query += ` AND g.trimester = ?`;
      params.push(trimester);
    }

    try {
      const [grades] = await db.execute(query, params);
      res.status(200).json({ message: "Grades fetched successfully", grades });
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

exports.getClassPerformanceReport = async (req, res) => {
    const { classId } = req.params; // Now using req.params to get classId

    try {
        // Query to get average, best, and worst grades for a specific class
        const [grades] = await db.execute(`
            SELECT 
                g.student_id, 
                u.full_name, 
                AVG(g.grade_value) AS average_grade, 
                MAX(g.grade_value) AS best_grade, 
                MIN(g.grade_value) AS worst_grade
            FROM Grades g
            INNER JOIN Users u ON g.student_id = u.user_id
            WHERE g.class_id = ?
            GROUP BY g.student_id, u.full_name
        `, [classId]);

        res.status(200).json({ 
            message: "Class performance report fetched successfully", 
            grades
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};