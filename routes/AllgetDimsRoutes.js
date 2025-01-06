const express = require('express');
const router = express.Router();
const { getDimensionsByTypeAndProductId, getAllDimsByProductId  } = require('../controllers/AllgetDims');

// Route for GET request
router.get('/type/:type/ProductID/:Product_id', getDimensionsByTypeAndProductId);
router.get('/ProductID/:Product_id', getAllDimsByProductId);

module.exports = router;
