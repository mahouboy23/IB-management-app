const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

// to get class by teacher ID
router.get('/classes/:teacherId', classController.getClassByTeacher);
router.get('/students/class/:classId', classController.getStudentsByClass);
router.get('/classes', classController.getAllClasses);
router.post('/classes', classController.createClass);
router.put('/classes/:classId', classController.updateClass);
router.delete('/classes/:classId', classController.deleteClass);
router.post('/classes/:classId/students/:studentId', classController.assignStudentToClass);
router.delete('/classes/:classId/students/:studentId', classController.removeStudentFromClass);

module.exports = router;