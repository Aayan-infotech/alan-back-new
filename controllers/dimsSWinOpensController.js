const dimsSideWindowOpens = require('../models/dimsSWinOpensModel'); 

// POST request: Create a new dimsSideWindowOpens entry
exports.createDimsSideWindowOpens = async (req, res) => {
    try {
        const { SideWindowOpens, value, Product_id } = req.body;

        // Create a new dimsSideWindowOpens document
        const newDimsSideWindowOpens = new dimsSideWindowOpens({
            SideWindowOpens,
            value,
            Product_id,
        });

        // Save the dimsSideWindowOpens to the database
        await newDimsSideWindowOpens.save();
        res.status(201).json({ message: "dimsSideWindowOpens created successfully", newDimsSideWindowOpens });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// GET request: Retrieve all dimsSideWindowOpens entries
exports.getDimsSideWindowOpens = async (req, res) => {
    try {
        // Use .find() to retrieve all dimsSideWindowOpens entries
        const dimsSideWindowOpenss = await dimsSideWindowOpens.find();
        res.status(200).json(dimsSideWindowOpenss);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// DELETE request: Delete a dimsSideWindowOpens entry by its ID
exports.deleteDimsSideWindowOpens = async (req, res) => {
    try {
        const { id } = req.params;

        // Corrected method: findByIdAndDelete
        const dimsSideWindowOpensToDelete = await dimsSideWindowOpens.findByIdAndDelete(id);

        if (!dimsSideWindowOpensToDelete) {
            return res.status(404).json({ message: "dimsSideWindowOpens not found" });
        }

        res.status(200).json({ message: "dimsSideWindowOpens deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};