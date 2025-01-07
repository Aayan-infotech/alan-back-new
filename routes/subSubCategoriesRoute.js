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
const {uploadToS3}=require('../common/multerConfig');

// Routes for CRUD operations
router.get('/subcategoryid/:sub_category_id', getSubSubCategoryBysubCategoryId);
router.post('/',uploadToS3, createsubsubCategorySchema);
router.get('/', getAllsubsubCategorySchemas);
router.get('/:id', getsubsubCategorySchemaById);
router.put('/:id', updatesubsubCategorySchema);
router.delete('/:id', deletesubsubCategorySchema);

module.exports = router;
