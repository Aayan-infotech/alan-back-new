const express = require('express');
const router = express.Router();
const { createWishlist, deleteWishlist,getWishlistByUser } = require('../controllers/wishlistController');


router.post('/', createWishlist);
router.delete('/DEL/:id', deleteWishlist);
router.get('/user/:user_id', getWishlistByUser);

module.exports = router;