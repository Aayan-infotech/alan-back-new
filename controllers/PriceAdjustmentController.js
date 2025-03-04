const Product = require("../models/ProductModel");
const PriceAdjustmentHistory = require("../models/PriceAdjustmentHistoryModel");

// Mass update product prices  
// exports.updatePrices = async (req, res) => {
//     try {
//         const { category_id, sub_category_id, sub_sub_category_id, updateFactor } = req.body;

//         if (!category_id || !updateFactor) {
//             return res.status(400).json({ error: "category_id and updateFactor are required." });
//         }

//         // Build query based on the provided parameters
//         let query = { category_id };
//         if (sub_sub_category_id) {
//             query.sub_sub_category_id = sub_sub_category_id;
//         } else if (sub_category_id) {
//             query.sub_category_id = sub_category_id;
//         }

//         // Update product prices based on multiplication factor
//         const result = await Product.updateMany(query, {
//             $mul: { price: updateFactor }
//         });

//         if (result.modifiedCount === 0) {
//             return res.status(404).json({ message: "No products found matching the criteria." });
//         }

//         // Log the price adjustment
//         const priceAdjustment = new PriceAdjustmentHistory({
//             category_id,
//             sub_category_id: sub_category_id || null,
//             sub_sub_category_id: sub_sub_category_id || null,
//             updatePercent: updateFactor 
//         });
//         await priceAdjustment.save();

//         res.status(200).json({ message: "Product prices updated successfully.", modifiedCount: result.modifiedCount });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };



exports.updatePrices = async (req, res) => {
    try {
        const { category_id, sub_category_id, sub_sub_category_id, updateFactor } = req.body;

        if (!updateFactor || isNaN(updateFactor)) {
            return res.status(400).json({ message: "Invalid update factor" });
        }

        let filter = { category_id };

        if (sub_category_id) {
            filter.sub_category_id = sub_category_id;
        }

        if (sub_sub_category_id) {
            filter.sub_sub_category_id = sub_sub_category_id;
        }

        // Find and update products that have a valid numeric price
        const result = await Product.updateMany(
            { ...filter, price: { $ne: null } }, // Ensure price is not null
            { $mul: { price: updateFactor } }
        );

        // Log the price adjustment
        await PriceAdjustmentHistory.create({
            category_id,
            sub_category_id: sub_category_id || null,
            sub_sub_category_id: sub_sub_category_id || null,
            updatePercent: updateFactor
        });

        res.json({ message: `${result.modifiedCount} products updated successfully.` });
    } catch (error) {
        console.error('Error updating prices:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Controller to get all price adjustments
exports.getAllPriceAdjustments = async (req, res) => {
  try {
    const priceAdjustments = await PriceAdjustmentHistory.find();  // Retrieve all documents from PriceAdjustment collection
    res.status(200).json(priceAdjustments);  // Send the result back as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });  // Handle server errors
  }
};
