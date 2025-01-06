const dimsinstallation = require('../models/dimsInstModel');
const mongoose = require('mongoose');

// POST request: Create a new dimsinstallation  entry
exports.createDimsinstallation = async (req, res) => {
    try {
        const { installation, value, Product_id } = req.body;

        // Create a new dimsinstallation  document
        const newDimsinstallation = new dimsinstallation({
            installation,
            value,
            Product_id,
        });

        // Save the dimsinstallation  to the database
        await newDimsinstallation.save();
        res.status(201).json({ message: "dimsinstallation  created successfully", newDimsinstallation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// GET request: Retrieve all dimsinstallation  entries
exports.getDimsinstallation = async (req, res) => {
    try {
        // Use .find() to retrieve all dimsinstallation entries
        const dimsinstallations = await dimsinstallation.find(); // Corrected variable name
        res.status(200).json(dimsinstallations); // Return dimsinstallations
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// DELETE request: Delete a dimsinstallation  entry by its ID
exports.deleteDimsinstallation = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the ID is valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        // Proceed with deletion
        const dimsinstallationToDelete = await dimsinstallation.findByIdAndDelete(id);

        if (!dimsinstallationToDelete) {
            return res.status(404).json({ message: "dimsinstallation not found" });
        }

        res.status(200).json({ message: "dimsinstallation deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};