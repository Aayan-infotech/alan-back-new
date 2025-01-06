const dimsColor = require('../models/dimsColorModel'); 

// POST request: Create a new dimsColor entry
exports.createDimsColor = async (req, res) => {
    try {
        const { Color, value, Product_id } = req.body;

        // Create a new dimsColor document
        const newDimsColor = new dimsColor({
            Color,
            value,
            Product_id,
        });

        // Save the dimsColor to the database
        await newDimsColor.save();
        res.status(201).json({ message: "dimsColor created successfully", newDimsColor });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// GET request: Retrieve all dimsColor entries
exports.getDimsColor = async (req, res) => {
    try {
        // Use .find() to retrieve all dimsColor entries
        const dimsColors = await dimsColor.find();
        res.status(200).json(dimsColors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// DELETE request: Delete a dimsColor entry by its ID
exports.deleteDimsColor = async (req, res) => {
    try {
        const { id } = req.params;

        // Corrected method: findByIdAndDelete
        const dimsColorToDelete = await dimsColor.findByIdAndDelete(id);

        if (!dimsColorToDelete) {
            return res.status(404).json({ message: "dimsColor not found" });
        }

        res.status(200).json({ message: "dimsColor deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

