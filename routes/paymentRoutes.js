const express = require('express');
const { createPaymentIntent, getDataFromPaymentIntent,completePayment } = require('../controllers/payment');
const router = express.Router();
const { verifyToken } = require('../middlewares/verifyToken');

router.post('/create-payment-intent', createPaymentIntent);
router.get('/completePayment/:session_id', verifyToken, completePayment);
module.exports = router;
