const express = require('express');
const router = express.Router();
const { getDimensionsByTypeAndProductId } = require('../controllers/AllgetDims');

// Route for GET request
router.get('/type/:type/ProductID/:Product_id', getDimensionsByTypeAndProductId);

module.exports = router;
