const DimswidthHeight = require('../models/dimsWHmodel');

// Create a new DimswidthHeight record
exports.createDimsWh = async (req, res) => {
    try {
        const { Product_id, widthHeight, value, amount } = req.body;

        const newDimsWh = new DimswidthHeight({
            Product_id,
            widthHeight,
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

// Get all DimswidthHeight records
exports.getDimsWh = async (req, res) => {
    try {
        const dimsWhRecords = await DimswidthHeight.find();
        return res.status(200).json(dimsWhRecords);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error retrieving records", error: error.message });
    }
};

// Delete a DimswidthHeight record by ID
exports.deleteDimsWh = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedDimsWh = await DimswidthHeight.findByIdAndDelete(id);

        if (!deletedDimsWh) {
            return res.status(404).json({ message: "Record not found" });
        }

        return res.status(200).json({ message: "Record deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error deleting record", error: error.message });
    }
};
