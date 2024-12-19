const express = require('express');
const router = express.Router();
const {
    createSubCategories,
    getAllSubCategoriess,
    getSubCategoriesById,
    deleteSubCategories,
    updateSubCategories,
} = require('../controllers/subCategoriesControllers');

// Routes for CRUD operations
router.post('/', createSubCategories);
router.get('/', getAllSubCategoriess);
router.get('/:id', getSubCategoriesById);
router.put('/:id', updateSubCategories);
router.delete('/:id', deleteSubCategories);

module.exports = router;
