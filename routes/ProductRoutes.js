const express = require('express');
const router = express.Router();

const { createProduct, getProducts, getProductByTypeAndId , updateProduct, deleteProduct} = require('../controllers/ProductControllers');
const {uploadToS3}=require('../common/multerConfig');

router.get('/type/:type/id/:id', getProductByTypeAndId);
router.post('/',uploadToS3, createProduct);
router.get('/', getProducts);
router.delete('/DEL/:id', deleteProduct);
// router.put('/:id', updateProduct);

module.exports = router;
