const express = require('express');
const router = express.Router();
const {
    createDimsinstallation ,
    getDimsinstallation ,
    deleteDimsinstallation ,
} = require('../controllers/dimsInstController');

// Route for POST request to create a new dimsinstallation 
router.post('/', createDimsinstallation );

// Route for GET request to fetch all dimsinstallation  entries
router.get('/', getDimsinstallation );

// Route for DELETE request to delete a dimsinstallation  entry by ID
router.delete('/:id', deleteDimsinstallation );

module.exports = router;