const Product = require("../models/ProductModel");
const PriceAdjustmentHistory = require("../models/PriceAdjustmentHistoryModel");
const SubSubCategory = require("../models/subSubCategoryModels");
const Categories = require("../models/categoriesModels");
const SubCategories = require("../models/subCategoryModels");


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

        // Determine price adjustment type
        const adjustmentType = updateFactor > 1 ? "increase" : "decrease";

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
            updatePercent: updateFactor,
            PriceAdjustment: adjustmentType
        });

        res.json({ message: `${result.modifiedCount} products updated successfully.` });
    } catch (error) {
        console.error('Error updating prices:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getAllPriceAdjustments = async (req, res) => {
    try {
      // Step 1: Get all PriceAdjustmentHistory
      const priceAdjustments = await PriceAdjustmentHistory.find();
  
      // Step 2: Map through products and manually fetch category, sub-category, and sub-sub-category data
      const priceAdjustmentsWithNames = await Promise.all(
        priceAdjustments.map(async (adjustment) => {
          const category = adjustment.category_id
            ? await Categories.findById(adjustment.category_id)
            : null;
          const subCategory = adjustment.sub_category_id
            ? await SubCategories.findById(adjustment.sub_category_id)
            : null;
          const subSubCategory = adjustment.sub_sub_category_id
            ? await SubSubCategory.findById(adjustment.sub_sub_category_id)
            : null;
  
          return {
            _id: adjustment._id,
            category_name: category ? category.name : "N/A",
            sub_category_name: subCategory ? subCategory.name : "N/A",
            sub_sub_category_name: subSubCategory ? subSubCategory.name : "N/A",
            updatePercent: adjustment.updatePercent,
            PriceAdjustment: adjustment.PriceAdjustment,
            date: adjustment.date,
          };
        })
      );
  
      res.status(200).json(priceAdjustmentsWithNames); // Send the result back as JSON
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" }); // Handle server errors
    }
  };


exports.updateProductPrices = async (req, res) => {
    try {
        const { category_id, sub_category_id, sub_sub_category_id, divide } = req.body;

        if (!divide || isNaN(divide) || divide <= 0) {
            return res.status(400).json({ message: "Invalid divide factor" });
        }

        let filter = { category_id };

        if (sub_category_id) {
            filter.sub_category_id = sub_category_id;
        }

        if (sub_sub_category_id) {
            filter.sub_sub_category_id = sub_sub_category_id;
        }

        // Determine price adjustment type
        const adjustmentType = divide > 1 ? "decrease" : "increase";

        // Find and update products that have a valid numeric price
        const result = await Product.updateMany(
            { ...filter, price: { $ne: null } }, 
            { $mul: { price: 1 / divide } } // Divide the price by the given factor
        );

        // Log the price adjustment
        await PriceAdjustmentHistory.create({
            category_id,
            sub_category_id: sub_category_id || null,
            sub_sub_category_id: sub_sub_category_id || null,
            updatePercent: divide,
            PriceAdjustment: adjustmentType
        });

        res.json({ message: `${result.modifiedCount} products updated successfully.` });
    } catch (error) {
        console.error('Error updating prices:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};