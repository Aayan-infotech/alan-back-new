const DimswhiteHeight  = require('../models/dimsWHmodel');

// Create a new DimswhiteHeight  record
exports.createDimsWh = async (req, res) => {
    try {
        const { Product_id, whiteHeight , value, amount } = req.body;

        const newDimsWh = new DimswhiteHeight ({
            Product_id,
            whiteHeight ,
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

// Get all DimswhiteHeight  records
exports.getDimsWh = async (req, res) => {
    try {
        const dimsWhRecords = await DimswhiteHeight .find();
        return res.status(200).json(dimsWhRecords);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error retrieving records", error: error.message });
    }
};

// Delete a DimswhiteHeight  record by ID
exports.deleteDimsWh = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedDimsWh = await DimswhiteHeight .findByIdAndDelete(id);

        if (!deletedDimsWh) {
            return res.status(404).json({ message: "Record not found" });
        }

        return res.status(200).json({ message: "Record deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error deleting record", error: error.message });
    }
};
