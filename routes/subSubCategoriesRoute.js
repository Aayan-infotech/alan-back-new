const express = require('express');
const router = express.Router();
const {
    createsubsubCategorySchema,
    getAllsubsubCategorySchemas,
    getsubsubCategorySchemaById,
    updatesubsubCategorySchema,
    deletesubsubCategorySchema,
} = require('../controllers/subSubCategoriesControllers');

// Routes for CRUD operations
router.post('/', createsubsubCategorySchema);
router.get('/', getAllsubsubCategorySchemas);
router.get('/:id', getsubsubCategorySchemaById);
router.put('/:id', updatesubsubCategorySchema);
router.delete('/:id', deletesubsubCategorySchema);

module.exports = router;
