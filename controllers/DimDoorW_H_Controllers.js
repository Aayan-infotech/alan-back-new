const DimDoorWidthHeight = require('../models/DimDoorW_H_Models');
const mongoose = require('mongoose');
// POST request: Create a new DimDoorWidthHeight entry
exports.createDimDoorWidthHeight = async (req, res) => {
    try {
        const { productId, widthHeight, value, price } = req.body;
        const newEntry = new DimDoorWidthHeight({ productId, widthHeight, value, price });
        await newEntry.save();
        res.status(201).json({ success: true, data: newEntry });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET request: Retrieve all DimDoorWidthHeight entries
// exports.getAllDimDoorWidthHeights = async (req, res) => {
//     try {
//         const entries = await DimDoorWidthHeight.find();
//         res.status(200).json({ success: true, data: entries });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// GET request: Retrieve dimensions by productId
exports.getDimDoorWidthHeightsProductId = async (req, res) => {
    try {
        const { productId } = req.params; // Get productId from request params

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }

        // Fetch dimensions filtered by productId
        const dimsinstallations = await DimDoorWidthHeight.find({ productId });

        if (!dimsinstallations.length) {
            return res.status(404).json({ message: "No dimensions found for this product" });
        }

        res.status(200).json(dimsinstallations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// DELETE request: Delete a DimDoorWidthHeight entry by its ID
exports.deleteDimDoorWidthHeight = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEntry = await DimDoorWidthHeight.findByIdAndDelete(id);
        if (!deletedEntry) {
            return res.status(404).json({ success: false, message: 'Entry not found' });
        }
        res.status(200).json({ success: true, message: 'Entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
