const express = require('express');
const { createPaymentIntent, getDataFromPaymentIntent } = require('../controllers/payment');
const router = express.Router();
const { verifyToken } = require('../middlewares/verifyToken');

router.post('/create-payment-intent', createPaymentIntent);
router.get('/payment-details/:paymentIntentId',verifyToken, getDataFromPaymentIntent)
module.exports = router;
