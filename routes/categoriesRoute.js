const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getAllCategories,
  updateStatus
} = require('../controllers/categoriesControllers');
const {uploadToS3}=require('../common/multerConfig');

router.get('/getAllCategories',getAllCategories );
router.post('/',uploadToS3,createCategory);
router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.put('/:id',uploadToS3,updateCategory);
router.put('/updateStatus/:id',updateStatus);

router.delete('/:id', deleteCategory);

module.exports = router;
