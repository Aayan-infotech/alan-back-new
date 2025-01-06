const express = require('express');
const router = express.Router();
const {
    createDimsPanelSpacing,
    getDimsPanelSpacing,
    deleteDimsPanelSpacing,
} = require('../controllers/dimsPSpacingController');

router.post('/', createDimsPanelSpacing);
router.get('/', getDimsPanelSpacing);
router.delete('/:id', deleteDimsPanelSpacing);

module.exports = router;
