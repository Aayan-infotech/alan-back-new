const ProductImage = require('../models/ProductImgModel'); // Adjust path as needed

// Function to add product images and associated product ID
exports.addProductImages = async (req, res) => {
    const imagePaths = req.fileLocations; // Ensure this contains the file URLs

    // Check if imagePaths is empty or undefined
    if (!imagePaths || imagePaths.length === 0) {
        return res.status(400).json({
            message: 'No images uploaded!'
        });
    }

    try {
        const { Product_id } = req.body;

        // Validate productId (if required)
        if (!Product_id) {
            return res.status(400).json({
                message: 'Product ID is required!'
            });
        }

        // Create new ProductImage document
        const newProductImage = new ProductImage({
            images: imagePaths,
            Product_id: Product_id,
        });

        // Save the document to the database
        await newProductImage.save();

        res.status(201).json({
            message: 'Product images added successfully!',
            productImage: newProductImage
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while adding product images',
            error: error.message
        });
    }
};

// // Function to delete product images by ID
// exports.deleteProductImage = async (req, res) => {
//     try {
//         const { id } = req.params; // Get the ID from the URL params

//         // Check if the ProductImage exists
//         const productImage = await ProductImage.findById(id);
//         if (!productImage) {
//             return res.status(404).json({
//                 message: 'Product image not found!'
//             });
//         }

//         // Delete the product image
//         await ProductImage.findByIdAndDelete(id);

//         res.status(200).json({
//             message: 'Product image deleted successfully!'
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             message: 'An error occurred while deleting the product image',
//             error: error.message
//         });
//     }
// };

// Function to get product images by product ID
exports.getProductImagesByProductId = async (req, res) => {
    try {
        const { productId } = req.params; // Get the product ID from the URL params

        // Find all product images associated with the given Product_id
        const productImages = await ProductImage.find({ Product_id: productId });

        if (!productImages.length) {
            return res.status(404).json({
                message: 'No images found for this product'
            });
        }

        res.status(200).json({
            message: 'Product images retrieved successfully!',
            productImages: productImages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while retrieving product images',
            error: error.message
        });
    }
};

exports.deleteProductImage = async (req, res) => {
    try {
        const { imageId } = req.params;  // Getting image ID from the URL parameter

        // Find the product image document by _id
        const productImage = await ProductImage.findById(imageId);
        
        if (!productImage) {
            return res.status(404).json({
                message: 'Product image not found!'
            });
        }

        // Delete the product image by its _id
        await ProductImage.findByIdAndDelete(imageId);

        res.status(200).json({
            message: 'Product image deleted successfully!'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'An error occurred while deleting the product image',
            error: error.message
        });
    }
};

