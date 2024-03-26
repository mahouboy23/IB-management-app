const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const classController = require('../controllers/classController');

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

router.get('/grades/filter/:studentId?/:classId?/:trimester?', gradeController.getFilteredGrades);

// New route to get all classes
router.get('/classes', classController.getAllClasses);

// New route to get all students
router.get('/students', classController.getAllStudents);

router.get('/grades/report/:classId', gradeController.getClassPerformanceReport);

module.exports = router;
