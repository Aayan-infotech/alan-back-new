const express = require('express');
const router = express.Router();
const {calculatePrice}=require('../controllers/productFormulaController')

router.post('/calculatePrice',calculatePrice);

module.exports = router;
