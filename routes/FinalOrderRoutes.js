const express = require('express');
const router = express.Router();
const FinalOrderController = require('../controllers/FinalOrderController');

// Routes
router.get('/getAllCustData', FinalOrderController.getAllCustData);

module.exports = router;