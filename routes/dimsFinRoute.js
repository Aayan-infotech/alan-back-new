const express = require('express');
const router = express.Router();
const {
    createDimsFin,
    getDimsFin,
    deleteDimsFin,
} = require('../controllers/dimsFinController');

// Route for POST request to create a new dimsGrid
router.post('/', createDimsFin);

// Route for GET request to fetch all dimsGrid entries
router.get('/', getDimsFin);

// Route for DELETE request to delete a dimsGrid entry by ID
router.delete('/:id', deleteDimsFin);

module.exports = router;
