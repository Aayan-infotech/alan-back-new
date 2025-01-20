const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { verifyToken } = require('../middlewares/verifyToken');

router.post('/create-order', OrderController.createOrder);
router.get('/orders', verifyToken, OrderController.getOrders);
router.put('/orders/:id', verifyToken, OrderController.updateOrder); // Update order route
router.delete('/orders/:id', verifyToken, OrderController.deleteOrder); // Delete order route

module.exports = router;
