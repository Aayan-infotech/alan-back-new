const express = require('express');
const router = express.Router();
const {
    createSubCategories,
    getAllSubCategoriess,
    getSubCategoriesById,
    deleteSubCategories,
    updateSubCategories,
    getSubCategoryByCategoryId,
} = require('../controllers/subCategoriesControllers');

const {uploadToS3}=require('../common/multerConfig');

// Routes for CRUD operations
router.get('/categoryid/:category_id', getSubCategoryByCategoryId);
router.post('/',uploadToS3, createSubCategories);
router.get('/', getAllSubCategoriess);
router.get('/:id', getSubCategoriesById);
router.put('/:id', updateSubCategories);
router.delete('/:id', deleteSubCategories);

module.exports = router;
