const DimsWhiteHeight = require('../models/dimsWHmodel');

// Create a new DimsWhiteHeight record
exports.createDimsWh = async (req, res) => {
    try {
        const { productId, whiteHeight, value, amount } = req.body;

        const newDimsWh = new DimsWhiteHeight({
            productId,
            whiteHeight,
            value,
            amount
        });

        // Save the new record to the database
        const savedDimsWh = await newDimsWh.save();
        return res.status(201).json(savedDimsWh);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error creating record", error: error.message });
    }
};

// Get all DimsWhiteHeight records
exports.getDimsWh = async (req, res) => {
    try {
        const dimsWhRecords = await DimsWhiteHeight.find();
        return res.status(200).json(dimsWhRecords);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error retrieving records", error: error.message });
    }
};

// Delete a DimsWhiteHeight record by ID
exports.deleteDimsWh = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedDimsWh = await DimsWhiteHeight.findByIdAndDelete(id);

        if (!deletedDimsWh) {
            return res.status(404).json({ message: "Record not found" });
        }

        return res.status(200).json({ message: "Record deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error deleting record", error: error.message });
    }
};
