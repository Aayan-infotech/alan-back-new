const express = require('express');
const router = express.Router();
const {
    createDimsGrid,
    getDimsGrids,
    deleteDimsGrid,
} = require('../controllers/dimsGridController');

// Route for POST request to create a new dimsGrid
router.post('/', createDimsGrid);

// Route for GET request to fetch all dimsGrid entries
router.get('/', getDimsGrids);

// Route for DELETE request to delete a dimsGrid entry by ID
router.delete('/:id', deleteDimsGrid);

module.exports = router;
