const express = require('express');
const router = express.Router();
const { createDimDoorWidthHeight , getDimDoorWidthHeightsProductId , deleteDimDoorWidthHeight} = require('../controllers/DimDoorW_H_Controllers');


router.post('/createDimDoorWidthHeight', createDimDoorWidthHeight);
router.get('/getAllDimDoorWidthHeights/:productId', getDimDoorWidthHeightsProductId);
router.delete('/deleteDimDoorWidthHeight/:id', deleteDimDoorWidthHeight);

module.exports = router;
