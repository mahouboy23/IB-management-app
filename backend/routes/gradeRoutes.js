const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');

// Route to add a new grade
router.post('/grades', gradeController.addGrade);

// Route to get grades by student ID
router.get('/grades/:studentId', gradeController.getGradesByStudent);

// Route to get grades by class ID
router.get('/grades/class/:classId', gradeController.getGradesByClass);

// Route to update a grade by grade ID
router.put('/grades/:gradeId', gradeController.updateGrade);

// Route to delete a grade by grade ID
router.delete('/grades/:gradeId', gradeController.deleteGrade);

module.exports = router;
