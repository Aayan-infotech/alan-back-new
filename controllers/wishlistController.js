const Wishlist = require('../models/WishlisModels');


// Add a product to the wishlistproduct
exports.createWishlist = async (req, res) => {
    try {
        const { product_id, user_id } = req.body;

        // Validate required fields
        if (!product_id || !user_id) {
            return res.status(400).json({ message: 'Product ID and User ID are required.' });
        }

        const newWishlistItem = new Wishlist({
            product_id,
            user_id
        });

        const savedItem = await newWishlistItem.save();

        res.status(201).json({
            message: 'Product added to wishlist successfully!',
            data: savedItem
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Remove a product from the wishlist
exports.deleteWishlist = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedItem = await Wishlist.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ message: 'Wishlist item not found' });
        }

        res.status(200).json({
            message: 'Product removed from wishlist successfully',
            data: deletedItem
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};