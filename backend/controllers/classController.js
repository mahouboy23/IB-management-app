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
