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


// const staticDimsColor = [
//     { Color: "Almond", Size: "36\" x 36\"", amount: 130.50 },
//     { Color: "Tan", Size: "36\" x 36\"", amount: 130.50 },
//     { Color: "Almond", Size: "36\" x 42\"", amount: 135.00 },
//     { Color: "Tan", Size: "36\" x 42\"", amount: 135.00 },
//     { Color: "Almond", Size: "36\" x 45\"", amount: 137.50 },
//     { Color: "Tan", Size: "36\" x 45\"", amount: 137.50 },
//     { Color: "Almond", Size: "36\" x 48\"", amount: 142.00 },
//     { Color: "Tan", Size: "36\" x 48\"", amount: 142.00 },
//     { Color: "Almond", Size: "36\" x 60\"", amount: 148.50 },
//     { Color: "Tan", Size: "36\" x 60\"", amount: 148.50 },
//     { Color: "Almond", Size: "48\" x 36\"", amount: 142.00 },
//     { Color: "Tan", Size: "48\" x 36\"", amount: 142.00 },
//     { Color: "Almond", Size: "48\" x 42\"", amount: 148.50 },
//     { Color: "Tan", Size: "48\" x 42\"", amount: 148.50 },
//     { Color: "Almond", Size: "48\" x 45\"", amount: 153.50 },
//     { Color: "Tan", Size: "48\" x 45\"", amount: 153.50 },
//     { Color: "Almond", Size: "48\" x 48\"", amount: 158.00 },
//     { Color: "Tan", Size: "48\" x 48\"", amount: 158.00 },
//     { Color: "Almond", Size: "48\" x 60\"", amount: 165.00 },
//     { Color: "Tan", Size: "48\" x 60\"", amount: 165.00 },
//     { Color: "Almond", Size: "60\" x 36\"", amount: 165.50 },
//     { Color: "Tan", Size: "60\" x 36\"", amount: 165.50 },
//     { Color: "Almond", Size: "60\" x 42\"", amount: 172.00 },
//     { Color: "Tan", Size: "60\" x 42\"", amount: 172.00 },
//     { Color: "Almond", Size: "60\" x 45\"", amount: 181.50 },
//     { Color: "Tan", Size: "60\" x 45\"", amount: 181.50 },
//     { Color: "Almond", Size: "60\" x 48\"", amount: 183.00 },
//     { Color: "Tan", Size: "60\" x 48\"", amount: 183.00 },
//     { Color: "Almond", Size: "60\" x 60\"", amount: 194.00 },
//     { Color: "Tan", Size: "60\" x 60\"", amount: 194.00 },
//     { Color: "Almond", Size: "72\" x 36\"", amount: 174.50 },
//     { Color: "Tan", Size: "72\" x 36\"", amount: 174.50 },
//     { Color: "Almond", Size: "72\" x 42\"", amount: 181.00 },
//     { Color: "Tan", Size: "72\" x 42\"", amount: 181.00 },
//     { Color: "Almond", Size: "72\" x 45\"", amount: 192.00 },
//     { Color: "Tan", Size: "72\" x 45\"", amount: 192.00 },
//     { Color: "Almond", Size: "72\" x 48\"", amount: 194.50 },
//     { Color: "Tan", Size: "72\" x 48\"", amount: 194.50 },
//     { Color: "Almond", Size: "72\" x 60\"", amount: 208.50 },
//     { Color: "Tan", Size: "72\" x 60\"", amount: 208.50 }
// ];

// let updatedRecords = new Set();  // Track updated records by a unique identifier (Color + Size)

// exports.updateAmount = async (req, res) => {
//     try {
//         const { Color, widthHeight, amount } = req.body;

//         if (!Color || !widthHeight || !amount) {
//             return res.status(400).json({ message: "Missing required fields" });
//         }

//         // If Color is "White", return the same amount without modification
//         if (Color.toLowerCase() === "white") {
//             // console.log("No changes made for White color, returning amount:", amount);  // Debugging
//             return res.status(200).json({ message: "No changes made", amount });
//         }

//         // Finding the matching record in staticDims
//         const existingRecord = staticDims.find(dim => dim.Color === Color && dim.Size === widthHeight);

//         if (!existingRecord) {
//             return res.status(404).json({ message: "No matching record found" });
//         }

//         // Debugging: Log the existing record and amount
//         // console.log("Existing record before update:", existingRecord);
//         // console.log("Amount to be added:", amount);

//         const recordIdentifier = `${Color}-${widthHeight}`;

//         // Check if the record has already been updated
//         if (updatedRecords.has(recordIdentifier)) {
//             // console.log(`Record ${recordIdentifier} has already been updated. Skipping further updates.`);
//             return res.status(200).json({
//                 message: "Record has already been updated previously",
//                 updatedRecord: existingRecord
//             });
//         }

//         // Prevent adding the amount again if it's already updated
//         existingRecord.amount += amount;

//         // Mark this record as updated
//         updatedRecords.add(recordIdentifier);

//         // Debugging: Log the updated record
//         // console.log("Existing record after update:", existingRecord);

//         // Return the updated record
//         res.status(200).json({
//             message: "Amount updated successfully",
//             updatedRecord: existingRecord
//         });
//     } catch (error) {
//         console.error("Error occurred:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };




const staticDimsColor = [
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

const staticDimsWh = [
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

// exports.updateAmount = async (req, res) => {
//     try {
//         const { Color, widthHeight, amount } = req.body;

//         // Find matching entry in staticDimsColor
//         const colorMatch = staticDimsColor.find(
//             (item) => item.Color === Color && item.Size === widthHeight
//         );

//         // Find matching entry in staticDimsWh
//         const whMatch = staticDimsWh.find(
//             (item) => item.widthHeight === widthHeight
//         );

//         if (!colorMatch || !whMatch) {
//             return res.status(404).json({ message: "No matching data found" });
//         }

//         let totalAmount = amount;
//         let colorAmount = colorMatch.amount;
//         let whAmount = whMatch.amount;

//         if (Color === "White") {
//             totalAmount += whAmount;
//         } else {
//             totalAmount += colorAmount + whAmount;
//         }

//         return res.status(200).json({
//             message: "Amount calculated successfully",
//             Color,
//             Size: widthHeight,
//             amount,
//             colorAmount,
//             whAmount,
//             totalAmount
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Server Error" });
//     }
// };


// exports.updateAmount = async (req, res) => {
//     try {
//         const { Color, widthHeight, amount } = req.body;

//         // Find matching entry in staticDimsColor
//         const colorMatch = staticDimsColor.find(
//             (item) => item.Color === Color && item.Size === widthHeight
//         );

//         // Find matching entry in staticDimsWh
//         const whMatch = staticDimsWh.find(
//             (item) => item.widthHeight === widthHeight
//         );

//         if (!colorMatch || !whMatch) {
//             return res.status(404).json({
//                 status: 404,
//                 success: false,
//                 message: "No matching data found",
//                 data: null
//             });
//         }

//         let totalAmount = amount;
//         let colorAmount = colorMatch.amount;
//         let whAmount = whMatch.amount;

//         if (Color === "White") {
//             totalAmount += whAmount;
//         } else {
//             totalAmount += colorAmount + whAmount;
//         }

//         return res.status(200).json({
//             status: 200,
//             success: true,
//             message: "Amount calculated successfully",
//             data: {
//                 Color,
//                 Size: widthHeight,
//                 amount,
//                 colorAmount,
//                 whAmount,
//                 totalAmount
//             }
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             status: 500,
//             success: false,
//             message: "Server Error",
//             data: null
//         });
//     }
// };




exports.updateAmount = async (req, res) => {
    try {
        const { Color, widthHeight, amount } = req.body;

        // Find matching entry in staticDimsColor (except when Color is "White")
        let colorMatch = null;
        if (Color !== "White") {
            colorMatch = staticDimsColor.find(
                (item) => item.Color === Color && item.Size === widthHeight
            );
        }

        // Find matching entry in staticDimsWh
        const whMatch = staticDimsWh.find(
            (item) => item.widthHeight === widthHeight
        );

        if ((!colorMatch && Color !== "White") || !whMatch) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "No matching data found",
                data: null
            });
        }

        let totalAmount = amount;
        let colorAmount = colorMatch ? colorMatch.amount : 0; // Only add if Color is NOT "White"
        let whAmount = whMatch.amount;

        // If color is "White", do not add colorAmount
        if (Color === "White") {
            totalAmount += whAmount;
            colorAmount = 0; // Explicitly set to 0 to avoid confusion
        } else {
            totalAmount += colorAmount + whAmount;
        }

        return res.status(200).json({
            status: 200,
            success: true,
            message: "Amount calculated successfully",
            data: {
                Color,
                Size: widthHeight,
                amount,
                colorAmount,
                whAmount,
                totalAmount
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: "Server Error",
            data: null
        });
    }
};
