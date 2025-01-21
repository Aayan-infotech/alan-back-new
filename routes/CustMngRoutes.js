const express = require('express');
const router = express.Router();
const CustMngController = require('../controllers/CustMngController');

router.post('/custCreate', CustMngController.createCustAcc);
router.post('/otpVerify', CustMngController.verifyOTP);
router.post('/login', CustMngController.login);
router.get('/customers', CustMngController.getAllCustomers);
router.get('/customers/:id', CustMngController.getCustomerById);
router.put('/customers/:id', CustMngController.updateCustomer);

module.exports = router;
