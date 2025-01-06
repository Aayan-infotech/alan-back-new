const dimsPanelSpacing = require('../models/dimsPSpacingModel'); 

// POST request: Create a new dimsPanelSpacing entry
exports.createDimsPanelSpacing = async (req, res) => {
    try {
        const { PanelSpacing, value, Product_id } = req.body;

        // Create a new dimsPanelSpacing document
        const newDimsPanelSpacing = new dimsPanelSpacing({
            PanelSpacing,
            value,
            Product_id,
        });

        // Save the dimsPanelSpacing to the database
        await newDimsPanelSpacing.save();
        res.status(201).json({ message: "dimsPanelSpacing created successfully", newDimsPanelSpacing });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// GET request: Retrieve all dimsPanelSpacing entries
exports.getDimsPanelSpacing = async (req, res) => {
    try {
        // Use .find() to retrieve all dimsPanelSpacing entries
        const dimsPanelSpacings = await dimsPanelSpacing.find();
        res.status(200).json(dimsPanelSpacings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// DELETE request: Delete a dimsPanelSpacing entry by its ID
exports.deleteDimsPanelSpacing = async (req, res) => {
    try {
        const { id } = req.params;

        // Corrected method: findByIdAndDelete
        const dimsPanelSpacingToDelete = await dimsPanelSpacing.findByIdAndDelete(id);

        if (!dimsPanelSpacingToDelete) {
            return res.status(404).json({ message: "dimsPanelSpacing not found" });
        }

        res.status(200).json({ message: "dimsPanelSpacing deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};