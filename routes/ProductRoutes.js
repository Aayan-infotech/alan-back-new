const express = require('express');
const router = express.Router();

const { createProduct, getProducts, getProductByTypeAndId } = require('../controllers/ProductControllers');
const {uploadToS3}=require('../common/multerConfig');

router.get('/type/:type/id/:id', getProductByTypeAndId);
router.post('/',uploadToS3, createProduct);
router.get('/', getProducts);

module.exports = router;
