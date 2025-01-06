const express = require('express');
const router = express.Router();
const {
    createDimsSideWindowOpens,
    getDimsSideWindowOpens,
    deleteDimsSideWindowOpens,
} = require('../controllers/dimsSWinOpensController');

// Route for POST request to create a new dimsSideWindowOpens
router.post('/', createDimsSideWindowOpens);

// Route for GET request to fetch all dimsSideWindowOpens entries
router.get('/', getDimsSideWindowOpens);

// Route for DELETE request to delete a dimsSideWindowOpens entry by ID
router.delete('/:id', deleteDimsSideWindowOpens);

module.exports = router;
