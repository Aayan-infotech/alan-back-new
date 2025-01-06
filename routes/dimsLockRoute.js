const express = require('express');
const router = express.Router();
const {
    createDimsLock,
    getDimsLock,
    deleteDimsLock,
} = require('../controllers/dimsLockController');

// Route for POST request to create a new dimsLock
router.post('/', createDimsLock);

// Route for GET request to fetch all dimsLock entries
router.get('/', getDimsLock);

// Route for DELETE request to delete a dimsLock entry by ID
router.delete('/:id', deleteDimsLock);

module.exports = router;