const express = require('express');
const router = express.Router();

const { createProduct, getProducts, getProductByTypeAndId } = require('../controllers/ProductControllers');

router.get('/type/:type/id/:id', getProductByTypeAndId);
router.post('/', createProduct);
router.get('/', getProducts);

module.exports = router;
