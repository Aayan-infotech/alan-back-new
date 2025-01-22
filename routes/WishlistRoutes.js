const express = require('express');
const router = express.Router();
const { createWishlist, deleteWishlist } = require('../controllers/wishlistController');


router.post('/', createWishlist);
router.delete('/DEL/:id', deleteWishlist);

module.exports = router;