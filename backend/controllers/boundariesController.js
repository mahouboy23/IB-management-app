const db = require('../config/database');

exports.addBoundary = async (req, res) => {
    const { classId, overValue, grades } = req.body; // grades is an array of {min, max} objects
    try {
        // Assuming a new table structure or a JSON-capable column to store the grades array
        const [result] = await db.execute(
            `INSERT INTO GradeBoundaries (class_id, over_value, grades) VALUES (?, ?, ?)`,
            [classId, overValue, JSON.stringify(grades)] // Convert grades array to JSON string if storing in a text column
        );
        res.status(201).json({ message: "Grade boundary added successfully", boundaryId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateBoundary = async (req, res) => {
    const { boundaryId } = req.params;
    const { overValue, grades } = req.body; // Accept updated grades array
    try {
        const [result] = await db.execute(
            `UPDATE GradeBoundaries SET over_value = ?, grades = ? WHERE boundary_id = ?`,
            [overValue, JSON.stringify(grades), boundaryId] // Convert grades array to JSON string
        );
        if (result.affectedRows) {
            res.status(200).json({ message: "Grade boundary updated successfully" });
        } else {
            res.status(404).json({ message: "Grade boundary not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteBoundary = async (req, res) => {
    const { boundaryId } = req.params;
    try {
        const [result] = await db.execute(
            `DELETE FROM GradeBoundaries WHERE boundary_id = ?`,
            [boundaryId]
        );
        if (result.affectedRows) {
            res.status(200).json({ message: "Grade boundary deleted successfully" });
        } else {
            res.status(404).json({ message: "Grade boundary not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBoundariesByTeacher = async (req, res) => {
    const { teacherId } = req.params;
    try {
        const [boundaries] = await db.execute(
            `SELECT * FROM GradeBoundaries WHERE class_id IN (
                SELECT class_id FROM Classes WHERE teacher_id = ?
            ) ORDER BY class_id, over_value ASC`,
            [teacherId]
        );
        const parsedBoundaries = boundaries.map(boundary => ({
            ...boundary,
            grades: JSON.parse(boundary.grades)
        }));
        res.status(200).json({ message: "Grade boundaries fetched successfully", boundaries: parsedBoundaries });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

