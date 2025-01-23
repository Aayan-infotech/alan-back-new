const Wishlist = require('../models/WishlisModels');
const Product = require('../models/ProductModel');


// Add a product to the wishlistproduct
exports.createWishlist = async (req, res) => {
    try {
        const { product_id, user_id } = req.body;

        // Validate required fields
        if (!product_id || !user_id) {
            return res.status(400).json({ message: 'Product ID and User ID are required.' });
        }

        // Check if the product is already in the wishlist
        const existingItem = await Wishlist.findOne({ product_id, user_id });
        if (existingItem) {
            return res.status(400).json({ message: 'Product is already in the wishlist.' });
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

// Get wishlist products by user_id
exports.getWishlistByUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        // Find all wishlist items for the user
        const wishlistItems = await Wishlist.find({ user_id }).populate('product_id');

        if (!wishlistItems || wishlistItems.length === 0) {
            return res.status(404).json({ message: 'No wishlist items found for this user.' });
        }

        // Extract product IDs and fetch product details
        const productDetails = await Product.find({
            _id: { $in: wishlistItems.map(item => item.product_id) }
        }).select('images name _id');

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Wishlist retrieved successfully',
            data: productDetails
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Server error',
            data: []
        });
    }
};