const dimsGlassType = require('../models/dimsGTypeModel'); 

// POST request: Create a new dimsGlassType entry
exports.createDimsGlassType = async (req, res) => {
    try {
        const { GlassType, value, Product_id } = req.body;

        // Create a new dimsGlassType document
        const newDimsGlassType = new dimsGlassType({
            GlassType,
            value,
            Product_id,
        });

        // Save the dimsGlassType to the database
        await newDimsGlassType.save();
        res.status(201).json({ message: "dimsGlassType created successfully", newDimsGlassType });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// GET request: Retrieve all dimsGlassType entries
exports.getDimsGlassType = async (req, res) => {
    try {
        // Use .find() to retrieve all dimsGlassType entries
        const dimsGlassTypes = await dimsGlassType.find();
        res.status(200).json(dimsGlassTypes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// DELETE request: Delete a dimsGlassType entry by its ID
exports.deleteDimsGlassType = async (req, res) => {
    try {
        const { id } = req.params;

        // Corrected method: findByIdAndDelete
        const dimsGlassTypeToDelete = await dimsGlassType.findByIdAndDelete(id);

        if (!dimsGlassTypeToDelete) {
            return res.status(404).json({ message: "dimsGlassType not found" });
        }

        res.status(200).json({ message: "dimsGlassType deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};