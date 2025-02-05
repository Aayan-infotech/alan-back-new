const DimswidthHeight = require('../models/dimsWHmodel');

// Create a new DimswidthHeight   record
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

// Get all DimswidthHeight   records
exports.getDimsWh = async (req, res) => {
    try {
        const dimsWhRecords = await DimswidthHeight.find();
        return res.status(200).json(dimsWhRecords);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error retrieving records", error: error.message });
    }
};

// Delete a DimswidthHeight   record by ID
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


// only Gardenwindow
// Static Data
const staticDims = [
    { widthHeight: "36\" x 36\"", amount: 1443.50 },
    { widthHeight: "36\" x 42\"", amount: 1492.50 },
    { widthHeight: "36\" x 45\"", amount: 1517.50 },
    { widthHeight: "36\" x 48\"", amount: 1544.00 },
    { widthHeight: "36\" x 60\"", amount: 1640.00 },
    { widthHeight: "48\" x 36\"", amount: 1580.00 },
    { widthHeight: "48\" x 42\"", amount: 1630.50 },
    { widthHeight: "48\" x 45\"", amount: 1707.50 },
    { widthHeight: "48\" x 48\"", amount: 1735.00 },
    { widthHeight: "48\" x 60\"", amount: 1842.50 },
    { widthHeight: "60\" x 36\"", amount: 1839.00 },
    { widthHeight: "60\" x 42\"", amount: 1899.50 },
    { widthHeight: "60\" x 45\"", amount: 1991.50 },
    { widthHeight: "60\" x 48\"", amount: 2022.00 },
    { widthHeight: "60\" x 60\"", amount: 2144.50 },
    { widthHeight: "72\" x 36\"", amount: 1922.50 },
    { widthHeight: "72\" x 42\"", amount: 2005.50 },
    { widthHeight: "72\" x 45\"", amount: 2105.50 },
    { widthHeight: "72\" x 48\"", amount: 2140.50 },
    { widthHeight: "72\" x 60\"", amount: 2277.50 }
];

// API to insert static data product id  67a31d68e76668c39d9725b6
exports.createDimsWhGardenwindow = async (req, res) => {
    try {
        const Product_id = "67a31d68e76668c39d9725b6"; // Static Product_id

        // Map static data to include Product_id
        const staticDimsWithProductId = staticDims.map(dim => ({
            ...dim,
            Product_id
        }));

        // Insert data into MongoDB
        await DimswidthHeight.insertMany(staticDimsWithProductId);

        return res.status(201).json({ message: "Static data inserted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error inserting static data", error: error.message });
    }
};
// http://localhost:7878/api/dimsWH/WhGardenwindow


// http://localhost:7878/api/dimsWH/Prd/67a31d68e76668c39d9725b6
exports.getDimsWhByPrdId = async (req, res) => {
    try {
        const dimsWhRecord = await DimswidthHeight.find({ Product_id: req.params.PrdId }); // Correct query
        if (!dimsWhRecord) {
            return res.status(404).json({ message: "DimswidthHeight record not found" });
        }
        return res.status(200).json(dimsWhRecord);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error retrieving record", error: error.message });
    }
};

