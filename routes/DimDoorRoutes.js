// routes/DimDoorRoutes.js
const express = require('express');
const router = express.Router();
const { createDimDoor, getDimDoorByProductId, deleteDimDoor } = require('../controllers/DimDoorControllers');

router.post('/:modelName', createDimDoor);
router.get('/:modelName/:productId', getDimDoorByProductId);
router.delete('/:modelName/:id', deleteDimDoor);

module.exports = router;