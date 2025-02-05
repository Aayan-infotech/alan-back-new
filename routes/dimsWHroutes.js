const express = require('express');
const router = express.Router();
const { createDimsWh, getDimsWh, deleteDimsWh,createDimsWhGardenwindow,getDimsWhByPrdId } = require('../controllers/dimsWHController');


router.post('/', createDimsWh);
router.get('/', getDimsWh);
router.get('/Prd/:PrdId', getDimsWhByPrdId);
router.delete('/:id', deleteDimsWh);
router.post('/WhGardenwindow', createDimsWhGardenwindow); // only Gardenwindow 

module.exports = router;
