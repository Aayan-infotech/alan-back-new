const express = require('express');
const router = express.Router();
const contentController = require('../controllers/StaticContentControllers');


router.get('/:section', contentController.getContent);
router.post('/', contentController.upsertContent);

module.exports = router;
