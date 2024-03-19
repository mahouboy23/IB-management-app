const express = require('express');
const router = express.Router();
const boundariesController = require('../controllers/boundariesController');

router.post('/grade-boundaries', boundariesController.addBoundary);
router.put('/grade-boundaries/:boundaryId', boundariesController.updateBoundary);
router.delete('/grade-boundaries/:boundaryId', boundariesController.deleteBoundary);
router.get('/grade-boundaries', boundariesController.getBoundaries);

module.exports = router;
