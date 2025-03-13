const Product = require('../models/ProductModel');

// Dimension constraints
const dimensionLimits = {
    // "XO_Slider": { min: [24, 9.5], max: [48, 72] },
    "XO_Slider": { min: [72, 9.5], max: [48, 72] },
    "XOX_Slider": { min: [72, 12], max: [144, 72] },
    "Awning_Window": { min: [18, 18], max: [60, 60] },
    "Single_Hung_Windows": { min: [11.5, 18], max: [48, 72] },
    "Double_Hung_Windows": { min: [12, 24], max: [48, 84] },
    "Picture_Window": { min: [8, 9.5], max: [96, 60] },
    "Casement_Window": { min: [16, 18], max: [36, 72] },
};

// Formula map
const formulaMap = {
    "XO_Slider": (h, w) => (h + w) * 3.694 + 38,
    "XOX_Slider": (h, w) => (h + w) * 4.639 - 108,
    "Single_Hung_Windows": (h, w) => (h + w) * 3.694 + 50,
    "Double_Hung_Windows": (h, w) => (h + w) * 3.694 + 50,
    "Picture_Window": (h, w) => (h + w) * 3.696 - 50,
    "Casement_Window": (h, w) => (h + w) * 5.37 + 162,
    "Awning_Window": (h, w) => (h + w) * 4.7 + 235,
};

// const formulaMap = {
//     "XO_Slider": (h, w) => h + w * 3.694 + 38,
//     "XOX_Slider": (h, w) => h + w * 4.639 - 108,
//     "Single_Hung_Windows": (h, w) => h + w * 3.694 + 50,
//     "Double_Hung_Windows": (h, w) => h + w * 3.694 + 50,
//     "Picture_Window": (h, w) => h + w * 3.696 - 50,
//     "Casement_Window": (h, w) => h + w * 5.37 + 162,
//     "Awning_Window": (h, w) => h + w * 4.7 + 235,
// };


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

        const productName = product.name;
        const formula = formulaMap[productName];
        const limits = dimensionLimits[productName];

        if (!formula || !limits) {
            return res.status(400).json({
                success: false,
                message: `No formula or dimension limits found for the product: ${productName}.`
            });
        }

        // Validate dimensions
        const [minWidth, minHeight] = limits.min;
        const [maxWidth, maxHeight] = limits.max;

        if (width < minWidth || height < minHeight || width > maxWidth || height > maxHeight) {
            return res.status(200).json({
                status: 200,
                success: false,
                message: `The dimensions for ${productName} are out of range. Allowed range: Minimum ${minHeight} × ${minWidth}, Maximum ${maxHeight} × ${maxWidth}.`
                // message: `Dimensions out of range for ${productName}. Minimum: ${minWidth}" x ${minHeight}", Maximum: ${maxWidth}" x ${maxHeight}".`
            });
        }

        // Calculate price
        const formulaPrice = formula(height, width);
        const totalPrice = formulaPrice + Price;

        return res.status(200).json({
            status: 200,
            success: true,
            message: `Price calculated successfully for product`,
            productNAME: productName,
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