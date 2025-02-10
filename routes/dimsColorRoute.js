const express = require('express');
const router = express.Router();
const {
    createDimsColor,
    getDimsColor,
    deleteDimsColor,
    createDimsColorGardenwindow,
    updateAmount
} = require('../controllers/dimsColorController');

// Route for POST request to create a new dimsColor
router.post('/', createDimsColor);

// Route for GET request to fetch all dimsColor entries
router.get('/', getDimsColor);

// Route for DELETE request to delete a dimsColor entry by ID
router.delete('/:id', deleteDimsColor);

router.post('/createDimsColorGardenwindow', createDimsColorGardenwindow); // only use Gardenwindow
router.put('/updateAmount', updateAmount);


module.exports = router;
