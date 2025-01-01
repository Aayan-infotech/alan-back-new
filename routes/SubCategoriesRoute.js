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

// Routes for CRUD operations
router.get('/categoryid/:category_id', getSubCategoryByCategoryId);
router.post('/', createSubCategories);
router.get('/', getAllSubCategoriess);
router.get('/:id', getSubCategoriesById);
router.put('/:id', updateSubCategories);
router.delete('/:id', deleteSubCategories);

module.exports = router;
