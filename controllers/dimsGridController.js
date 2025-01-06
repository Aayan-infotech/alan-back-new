const dimsGrid = require('../models/dimsGridModel'); // Import the model

// POST request: Create a new dimsGrid entry
exports.createDimsGrid = async (req, res) => {
    try {
        const { Grid, value, Product_id } = req.body;

        // Create a new dimsGrid document
        const newDimsGrid = new dimsGrid({
            Grid,
            value,
            Product_id,
        });

        // Save the dimsGrid to the database
        await newDimsGrid.save();
        res.status(201).json({ message: "dimsGrid created successfully", newDimsGrid });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET request: Retrieve all dimsGrid entries
exports.getDimsGrids = async (req, res) => {
    try {
        const dimsGrids = await dimsGrid.find();
        res.status(200).json(dimsGrids);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE request: Delete a dimsGrid entry by its ID
exports.deleteDimsGrid = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the dimsGrid by ID
        const dimsGridToDelete = await dimsGrid.findByIdAndDelete(id);

        if (!dimsGridToDelete) {
            return res.status(404).json({ message: "dimsGrid not found" });
        }

        res.status(200).json({ message: "dimsGrid deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
