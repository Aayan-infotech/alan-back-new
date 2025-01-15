// const express = require('express');
// const router = express.Router();
// // import { calculatePrice } from '../controllers/prdFrm.js';
// const { calculatePrice} = require('../controllers/prdFrm');


// // const router = express.Router();

// // POST route to calculate price
// router.post('/calculate-price', calculatePrice);

// export default router;



const express = require('express');
const router = express.Router();
const {calculatePrice} = require('../controllers/prdFrm');


router.post('/calculatePrice', calculatePrice);


module.exports = router;
