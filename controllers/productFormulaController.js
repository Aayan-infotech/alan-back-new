const Product = require('../models/ProductModel');


// Formula map
const formulaMap = {
    "XO_Slider": (h, w) => h * w * 3.694 + 38,
    "XOX_Slider": (h, w) => h * w * 4.639 - 108,
    "Single_Hung_Windows": (h, w) => h * w * 3.694 + 50,
    "Double_Hung_Windows": (h, w) => h * w * 3.694 + 50,
    "Picture_Window": (h, w) => h * w * 3.696 - 50,
};

// Calculate price controller
exports.calculatePrice = async (req, res) => {
    const { width, height, Product_id, Price } = req.body;

    // Validate input
    if (!width || !height || !Product_id || Price === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Width, height, Product_id, and Price are required.'
        });
    }

    try {
        // Find product by ID
        const product = await Product.findById(Product_id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found.'
            });
        }

        // Get the formula based on product name and calculate the formula-based price
        const formula = formulaMap[product.name];
        if (!formula) {
            return res.status(400).json({
                success: false,
                message: `No formula found for the product: ${product.name}.`
            });
        }

        const formulaPrice = formula(height, width);
        const totalPrice = formulaPrice + Price;

        return res.status(200).json({
            status:200,
            success: true,
            message: `Price calculated successfully for product`,
            productNAME: `${product.name}`,
            data: { width, height, formulaPrice, providedPrice: Price, totalPrice }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error.',
            error: error.message
        });
    }
};
 