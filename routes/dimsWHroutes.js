const express = require('express');
const router = express.Router();
const { createDimsWh, getDimsWh, deleteDimsWh } = require('../controllers/dimsWHController');


router.post('/', createDimsWh);
router.get('/', getDimsWh);
router.delete('/:id', deleteDimsWh);

module.exports = router;
