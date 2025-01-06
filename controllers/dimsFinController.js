const dimsFin = require('../models/dimsFinModel'); 

// POST request: Create a new dimsfin entry
exports.createDimsFin = async (req, res) => {
    try {
        const { Fin, value, Product_id } = req.body;

        // Create a new dimsFin document
        const newDimsFin = new dimsFin({
            Fin,
            value,
            Product_id,
        });

        // Save the dimsFin to the database
        await newDimsFin.save();
        res.status(201).json({ message: "dimsFin created successfully", newDimsFin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET request: Retrieve all dimsFin entries
exports.getDimsFin = async (req, res) => {
    try {
        const dimsFins = await dimsFin.find();
        res.status(200).json(dimsFins);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE request: Delete a dimsFin entry by its ID
exports.deleteDimsFin = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the dimsFin by ID
        const dimsFinToDelete = await dimsFin.findByIdAndDelete(id);

        if (!dimsFinToDelete) {
            return res.status(404).json({ message: "dimsFin not found" });
        }

        res.status(200).json({ message: "dimsFin deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
