const express = require('express');
const router = express.Router();
const { updatePrices,getAllPriceAdjustments,updateProductPrices } = require('../controllers/PriceAdjustmentController');

router.post('/PriceAdjustmentIncrease', updatePrices); // increase
router.get('/getAllPriceAdjustments', getAllPriceAdjustments);
router.post('/PriceAdjustmentDecrease', updateProductPrices);  // decrease

module.exports = router;