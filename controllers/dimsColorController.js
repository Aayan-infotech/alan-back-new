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


// Static Data Array

const DimsColor = require("../models/dimsColorModel");

// Static Data Array
// const staticDims = [
//     { Color: "Almond & Tan 36\" x 36\"", amount: 130.50 },
//     { Color: "Almond & Tan 36\" x 42\"", amount: 135.00 },
//     { Color: "Almond & Tan 36\" x 45\"", amount: 137.50 },
//     { Color: "Almond & Tan 36\" x 48\"", amount: 142.00 },
//     { Color: "Almond & Tan 36\" x 60\"", amount: 148.50 },
//     { Color: "Almond & Tan 48\" x 36\"", amount: 142.00 },
//     { Color: "Almond & Tan 48\" x 42\"", amount: 148.50 },
//     { Color: "Almond & Tan 48\" x 45\"", amount: 153.50 },
//     { Color: "Almond & Tan 48\" x 48\"", amount: 158.00 },
//     { Color: "Almond & Tan 48\" x 60\"", amount: 165.00 },
//     { Color: "Almond & Tan 60\" x 36\"", amount: 165.50 },
//     { Color: "Almond & Tan 60\" x 42\"", amount: 172.00 },
//     { Color: "Almond & Tan 60\" x 45\"", amount: 181.50 },
//     { Color: "Almond & Tan 60\" x 48\"", amount: 183.00 },
//     { Color: "Almond & Tan 60\" x 60\"", amount: 194.00 },
//     { Color: "Almond & Tan 72\" x 36\"", amount: 174.50 },
//     { Color: "Almond & Tan 72\" x 42\"", amount: 181.00 },
//     { Color: "Almond & Tan 72\" x 45\"", amount: 192.00 },
//     { Color: "Almond & Tan 72\" x 48\"", amount: 194.50 },
//     { Color: "Almond & Tan 72\" x 60\"", amount: 208.50 }
// ];

// POST request: Insert static data into dimsColor collection with Product_id
exports.createDimsColorGardenwindow = async (req, res) => {
    try {
        const Product_id = "67a31d68e76668c39d9725b6"; // Static Product_id

        // Map static data to include Product_id
        const dataToInsert = staticDims.map(dim => ({
            ...dim,
            Product_id
        }));

        // Insert data into MongoDB
        await DimsColor.insertMany(dataToInsert);

        res.status(201).json({ message: "Static dimsColorGardenwindow data inserted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// plz only Garden Window


const staticDims = [
    { Color: "Almond", Size: "36\" x 36\"", amount: 130.50 },
    { Color: "Tan", Size: "36\" x 36\"", amount: 130.50 },
    { Color: "Almond", Size: "36\" x 42\"", amount: 135.00 },
    { Color: "Tan", Size: "36\" x 42\"", amount: 135.00 },
    { Color: "Almond", Size: "36\" x 45\"", amount: 137.50 },
    { Color: "Tan", Size: "36\" x 45\"", amount: 137.50 },
    { Color: "Almond", Size: "36\" x 48\"", amount: 142.00 },
    { Color: "Tan", Size: "36\" x 48\"", amount: 142.00 },
    { Color: "Almond", Size: "36\" x 60\"", amount: 148.50 },
    { Color: "Tan", Size: "36\" x 60\"", amount: 148.50 },
    { Color: "Almond", Size: "48\" x 36\"", amount: 142.00 },
    { Color: "Tan", Size: "48\" x 36\"", amount: 142.00 },
    { Color: "Almond", Size: "48\" x 42\"", amount: 148.50 },
    { Color: "Tan", Size: "48\" x 42\"", amount: 148.50 },
    { Color: "Almond", Size: "48\" x 45\"", amount: 153.50 },
    { Color: "Tan", Size: "48\" x 45\"", amount: 153.50 },
    { Color: "Almond", Size: "48\" x 48\"", amount: 158.00 },
    { Color: "Tan", Size: "48\" x 48\"", amount: 158.00 },
    { Color: "Almond", Size: "48\" x 60\"", amount: 165.00 },
    { Color: "Tan", Size: "48\" x 60\"", amount: 165.00 },
    { Color: "Almond", Size: "60\" x 36\"", amount: 165.50 },
    { Color: "Tan", Size: "60\" x 36\"", amount: 165.50 },
    { Color: "Almond", Size: "60\" x 42\"", amount: 172.00 },
    { Color: "Tan", Size: "60\" x 42\"", amount: 172.00 },
    { Color: "Almond", Size: "60\" x 45\"", amount: 181.50 },
    { Color: "Tan", Size: "60\" x 45\"", amount: 181.50 },
    { Color: "Almond", Size: "60\" x 48\"", amount: 183.00 },
    { Color: "Tan", Size: "60\" x 48\"", amount: 183.00 },
    { Color: "Almond", Size: "60\" x 60\"", amount: 194.00 },
    { Color: "Tan", Size: "60\" x 60\"", amount: 194.00 },
    { Color: "Almond", Size: "72\" x 36\"", amount: 174.50 },
    { Color: "Tan", Size: "72\" x 36\"", amount: 174.50 },
    { Color: "Almond", Size: "72\" x 42\"", amount: 181.00 },
    { Color: "Tan", Size: "72\" x 42\"", amount: 181.00 },
    { Color: "Almond", Size: "72\" x 45\"", amount: 192.00 },
    { Color: "Tan", Size: "72\" x 45\"", amount: 192.00 },
    { Color: "Almond", Size: "72\" x 48\"", amount: 194.50 },
    { Color: "Tan", Size: "72\" x 48\"", amount: 194.50 },
    { Color: "Almond", Size: "72\" x 60\"", amount: 208.50 },
    { Color: "Tan", Size: "72\" x 60\"", amount: 208.50 }
];

exports.updateAmount = async (req, res) => {
    try {
        const { Color, widthHeight, amount } = req.body;

        if (!Color || !widthHeight || !amount) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // If Color is "White", return the same amount without modification
        if (Color.toLowerCase() === "white") {
            return res.status(200).json({ message: "No changes made", amount });
        }

        // Finding the matching record in staticDims
        const existingRecord = staticDims.find(dim => dim.Color === Color && dim.Size === widthHeight);

        if (!existingRecord) {
            return res.status(404).json({ message: "No matching record found" });
        }

        // Updating the amount
        existingRecord.amount += amount;

        res.status(200).json({ message: "Amount updated successfully", updatedRecord: existingRecord });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
