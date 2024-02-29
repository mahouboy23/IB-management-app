const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/login', [
    body('username').not().isEmpty().trim().escape(),
    body('password').not().isEmpty()
], authController.login);

router.get('/students', authController.getAllStudents);

module.exports = router;
