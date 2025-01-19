const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { verifyToken } = require('../middlewares/verifyToken');

router.post('/create-order', OrderController.createOrder);
router.get('/orders', verifyToken, OrderController.getOrders);

module.exports = router;
