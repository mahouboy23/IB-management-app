const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/classController');

// to get class by teacher ID
router.get('/classes/:teacherId', gradeController.getClassByTeacher);

module.exports = router;