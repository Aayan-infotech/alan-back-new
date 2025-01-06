const dimsTampering = require('../models/dimsTamperModel'); 

// POST request: Create a new dimsTampering entry
exports.createDimsTampering = async (req, res) => {
    try {
        const { Tampering, value, Product_id } = req.body;

        // Create a new dimsTampering document
        const newDimsTampering = new dimsTampering({
            Tampering,
            value,
            Product_id,
        });

        // Save the dimsTampering to the database
        await newDimsTampering.save();
        res.status(201).json({ message: "dimsTampering created successfully", newDimsTampering });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// GET request: Retrieve all dimsTampering entries
exports.getDimsTampering = async (req, res) => {
    try {
        // Use .find() to retrieve all dimsTampering entries
        const dimsTamperings = await dimsTampering.find();
        res.status(200).json(dimsTamperings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// DELETE request: Delete a dimsTampering entry by its ID
exports.deleteDimsTampering = async (req, res) => {
    try {
        const { id } = req.params;

        // Corrected method: findByIdAndDelete
        const dimsTamperingToDelete = await dimsTampering.findByIdAndDelete(id);

        if (!dimsTamperingToDelete) {
            return res.status(404).json({ message: "dimsTampering not found" });
        }

        res.status(200).json({ message: "dimsTampering deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};