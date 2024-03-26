const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Update the path to where your UserController is located

router.post('/users', userController.addUser);
router.get('/users/get', userController.getUsers);
router.put('/users/update/:userId', userController.updateUser);
router.delete('/users/:userId', userController.deleteUser);
router.get('/users/dashboard', userController.getDashboardOverview);
module.exports = router;
