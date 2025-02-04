const express = require('express');
const { createPaymentIntent,stripeWebhook } = require('../controllers/payment');
const router = express.Router();

router.post('/create-payment-intent', createPaymentIntent);
router.post("/webhook", stripeWebhook);
module.exports = router;
