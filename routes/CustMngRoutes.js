const express = require('express');
const router = express.Router();
const CustMngController = require('../controllers/CustMngController');

router.post('/custCreate', CustMngController.createCustAcc);
router.post('/otpVerify', CustMngController.verifyOTP);

module.exports = router;
