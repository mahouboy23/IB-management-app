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

  exports.getClassesByStudent = async (req, res) => {
    const { studentId } = req.params;
    try {
        const [classes] = await db.execute(`
            SELECT 
                c.class_id,
                c.class_name,
                c.grade_level,
                c.subject,
                u.full_name AS teacher_name
            FROM 
                Classes c
            JOIN
                StudentClasses sc ON c.class_id = sc.class_id
            JOIN
                Users u ON c.teacher_id = u.user_id
            WHERE 
                sc.student_id = ?
        `, [studentId]);
        res.status(200).json({ message: "Classes fetched successfully", classes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
  

  exports.getAllClasses = async (req, res) => {
    try {
        const [classes] = await db.execute(`
            SELECT 
                c.class_id,
                c.class_name,
                c.grade_level,
                c.subject,
                u.full_name AS teacher_name
            FROM 
                Classes c
            JOIN
                Users u ON c.teacher_id = u.user_id
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

exports.createClass = async (req, res) => {
    const { className, gradeLevel, subject, teacherId } = req.body;
    try {
        const [result] = await db.execute(`
            INSERT INTO Classes (class_name, grade_level, subject, teacher_id)
            VALUES (?, ?, ?, ?)
        `, [className, gradeLevel, subject, teacherId]);
        res.status(201).json({ message: "Class created successfully", classId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateClass = async (req, res) => {
    const { classId } = req.params;
    const { className, gradeLevel, subject, teacherId } = req.body;
    try {
        await db.execute(`
            UPDATE Classes 
            SET class_name = ?, grade_level = ?, subject = ?, teacher_id = ?
            WHERE class_id = ?
        `, [className, gradeLevel, subject, teacherId, classId]);
        res.status(200).json({ message: "Class updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteClass = async (req, res) => {
    const { classId } = req.params;
    try {
      // First, delete dependent records
      await db.execute(`DELETE FROM studentclasses WHERE class_id = ?`, [classId]);
      // Then, delete the class
      await db.execute(`DELETE FROM Classes WHERE class_id = ?`, [classId]);
      res.status(200).json({ message: "Class deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

exports.getStudentsNotInClass = async (req, res) => {
    const { classId } = req.params;
    try {
        const [studentsNotInClass] = await db.execute(`
            SELECT
                u.user_id,
                u.full_name
            FROM
                Users u
            WHERE
                u.role = 'student' AND u.user_id NOT IN (
                    SELECT student_id FROM StudentClasses WHERE class_id = ?
                )
        `, [classId]);
        res.status(200).json({ message: "Students not in class fetched successfully", students: studentsNotInClass });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.assignStudentToClass = async (req, res) => {
    const { classId, studentId } = req.params;
    try {
        await db.execute(`
            INSERT INTO StudentClasses (student_id, class_id)
            VALUES (?, ?)
        `, [studentId, classId]);
        res.status(201).json({ message: "Student assigned to class successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeStudentFromClass = async (req, res) => {
    const { classId, studentId } = req.params;
    try {
        await db.execute(`
            DELETE FROM StudentClasses 
            WHERE student_id = ? AND class_id = ?
        `, [studentId, classId]);
        res.status(200).json({ message: "Student removed from class successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
