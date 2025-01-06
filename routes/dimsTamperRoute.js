const express = require('express');
const router = express.Router();
const {
    createDimsTampering,
    getDimsTampering,
    deleteDimsTampering,
} = require('../controllers/dimsTamperController');

// Route for POST request to create a new dimsTampering
router.post('/', createDimsTampering);

// Route for GET request to fetch all dimsTampering entries
router.get('/', getDimsTampering);

// Route for DELETE request to delete a dimsTampering entry by ID
router.delete('/:id', deleteDimsTampering);

module.exports = router;