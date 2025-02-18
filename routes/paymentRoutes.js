const express = require('express');
const { createPaymentIntent, getDataFromPaymentIntent,completePayment,createIntent,paymentSuccess } = require('../controllers/payment');
const router = express.Router();
const { verifyToken } = require('../middlewares/verifyToken');

router.post('/create-payment-intent',verifyToken, createPaymentIntent);
router.get('/completePayment', verifyToken, completePayment);

router.post('/create-intent', verifyToken, createIntent);
router.get('/paymentSuccess', verifyToken, paymentSuccess);

module.exports = router;
