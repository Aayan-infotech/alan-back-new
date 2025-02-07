const express = require('express');
const router = express.Router();
const FinalOrderController = require('../controllers/FinalOrderController');
const { verifyToken } = require('../middlewares/verifyToken');

// Routes
router.get('/getAllCustData', FinalOrderController.getAllCustData);
router.get('/orderHistory',verifyToken, FinalOrderController.getOrdersByUserId);
router.put('/editFinalOrder/:id', FinalOrderController.editFinalOrder);
module.exports = router;
