const express = require('express');
const router = express.Router();
const {
    createsubsubCategorySchema,
    getAllsubsubCategorySchemas,
    getsubsubCategorySchemaById,
    updatesubsubCategorySchema,
    deletesubsubCategorySchema,
    getSubSubCategoryBysubCategoryId,
} = require('../controllers/subSubCategoriesControllers');

// Routes for CRUD operations
router.get('/subcategoryid/:sub_category_id', getSubSubCategoryBysubCategoryId);
router.post('/', createsubsubCategorySchema);
router.get('/', getAllsubsubCategorySchemas);
router.get('/:id', getsubsubCategorySchemaById);
router.put('/:id', updatesubsubCategorySchema);
router.delete('/:id', deletesubsubCategorySchema);

module.exports = router;
