const dimsLock = require('../models/dimsLockModel'); 

// POST request: Create a new dimsLock entry
exports.createDimsLock = async (req, res) => {
    try {
        const { Lock, value, Product_id } = req.body;

        // Create a new dimsLock document
        const newDimsLock = new dimsLock({
            Lock,
            value,
            Product_id,
        });

        // Save the dimsLock to the database
        await newDimsLock.save();
        res.status(201).json({ message: "dimsLock created successfully", newDimsLock });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// GET request: Retrieve all dimsLock entries
exports.getDimsLock = async (req, res) => {
    try {
        // Use .find() to retrieve all dimsLock entries
        const dimsLocks = await dimsLock.find();
        res.status(200).json(dimsLocks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// DELETE request: Delete a dimsLock entry by its ID
exports.deleteDimsLock = async (req, res) => {
    try {
        const { id } = req.params;

        // Corrected method: findByIdAndDelete
        const dimsLockToDelete = await dimsLock.findByIdAndDelete(id);

        if (!dimsLockToDelete) {
            return res.status(404).json({ message: "dimsLock not found" });
        }

        res.status(200).json({ message: "dimsLock deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};