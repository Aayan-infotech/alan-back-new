const express = require('express');
const router = express.Router();
const { updatePrices,getAllPriceAdjustments } = require('../controllers/PriceAdjustmentController');

router.post('/PriceAdjustment', updatePrices);
router.get('/getAllPriceAdjustments', getAllPriceAdjustments);


module.exports = router;