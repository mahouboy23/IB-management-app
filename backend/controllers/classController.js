const db = require('../config/database');

exports.getClassByTeacher = async (req, res) => {
    const { teacherId } = req.params;
    try {
        const [classes] = await db.execute(`
            SELECT 
                c.class_id,
                c.class_name,
                c.grade_level,
                c.subject,
                c.teacher_id
            FROM 
                Classes c
            WHERE 
                c.teacher_id = ?`, 
            [teacherId]
        );
        res.status(200).json({ message: "Classes fetched successfully", classes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStudentsByClass = async (req, res) => {
    const { classId } = req.params;
    try {
      const [students] = await db.execute(`
        SELECT
          u.user_id,
          u.full_name
        FROM
          Users u
        INNER JOIN
          StudentClasses sc ON u.user_id = sc.student_id
        WHERE
          sc.class_id = ?
      `, [classId]);
      res.status(200).json({ message: "Students fetched successfully", students });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  exports.getAllClasses = async (req, res) => {
    try {
        const [classes] = await db.execute(`
            SELECT 
                class_id,
                class_name,
                grade_level,
                subject,
                teacher_id
            FROM 
                Classes
        `);
        res.status(200).json({ message: "All classes fetched successfully", classes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// New method to get all students
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
        res.status(200).json({ message: "All students fetched successfully", students });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
