const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

// to get class by teacher ID
router.get('/classes/:teacherId', classController.getClassByTeacher);

router.get('/students/class/:classId', classController.getStudentsByClass);

module.exports = router;