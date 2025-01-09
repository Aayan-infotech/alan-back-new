const express = require('express');
const router = express.Router();
const { deleteProductImage,addProductImages,getProductImagesByProductId} = require('../controllers/ProductImagesContr'); 
const {uploadToS3}=require('../common/multerConfig'); 

// router.delete('/product-images/:id', deleteProductImage);
router.delete('/product-images/:imageId', deleteProductImage);
router.post('/product-images',uploadToS3, addProductImages);
router.get('/product-images/:productId', getProductImagesByProductId);


module.exports = router;
