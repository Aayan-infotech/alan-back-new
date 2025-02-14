const express = require('express');
const router = express.Router();

const { searchByName } = require('../controllers/searchControllers');

router.get('/', searchByName);

module.exports = router;
