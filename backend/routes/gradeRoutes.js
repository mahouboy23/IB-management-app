const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');

// Route to add a new grade
router.post('/grades', gradeController.addGrade);

module.exports = router;
