// const express = require('express');
// const router = express.Router();
// const { createPayment, executePayment } = require('../controllers/transactionController');
// const { verifyToken } = require('../middlewares/verifyToken');

// router.post('/create-payment', verifyToken, createPayment);
// router.get('/execute-payment', verifyToken, executePayment);

// module.exports = router;



const express = require('express');
const { createPayment, executePayment } = require('../controllers/transactionController');
const { verifyToken } = require('../middlewares/verifyToken');

const router = express.Router();

router.post('/create-payment', verifyToken, createPayment);
router.get('/execute-payment', verifyToken, executePayment);

module.exports = router;
