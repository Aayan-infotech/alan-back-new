const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getAllCategories
} = require('../controllers/categoriesControllers');

// Routes for CRUD operations
router.get('/getAllCategories',getAllCategories );
router.post('/', createCategory);
router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
