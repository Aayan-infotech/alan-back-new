const express = require('express');
const router = express.Router();
const {
    createDimsGlassType,
    getDimsGlassType,
    deleteDimsGlassType,
} = require('../controllers/dimsGTypeController');

// Route for POST request to create a new dimsGlassType
router.post('/', createDimsGlassType);

// Route for GET request to fetch all dimsGlassType entries
router.get('/', getDimsGlassType);

// Route for DELETE request to delete a dimsGlassType entry by ID
router.delete('/:id', deleteDimsGlassType);

module.exports = router;