const GuestCardMood = require('../models/GMCardsModels');
const CustomerManage = require('../models/CustMngModel');
const Product = require('../models/ProductModel');

// Create a new entry
exports.createSessionData = async (req, res) => {
    try {
        const {
            session_id,
            totalPrice,
            product_price,
            product_id,
            name,
            sku,
            images,
            selectedOptions,
            customDimensions
        } = req.body;

        // Process selectedOptions to only store the 'name'
        const processedSelectedOptions = {};
        if (selectedOptions) {
            for (const [key, option] of Object.entries(selectedOptions)) {
                processedSelectedOptions[key] = option.name;
            }
        }

        const newEntry = new GuestCardMood({
            session_id, // Add session_id
            totalPrice,
            product_price,
            product_id,
            name,
            sku,
            images,
            selectedOptions: processedSelectedOptions,
            customDimensions,
        });

        await newEntry.save();

        res.status(201).json({
            message: 'Session data created successfully!',
            data: newEntry,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error creating session data',
            error: error.message,
        });
    }
};

// Get session data by session_id
exports.getSessionData = async (req, res) => {
    try {
        const { session_id } = req.params;

        const entries = await GuestCardMood.find({ session_id });

        if (!entries.length) {
            return res.status(404).json({
                success: false,
                message: 'No data found for this session ID',
            });
        }

        const customer = await CustomerManage.findOne({ session_id }).select('-password -otp -status -ins_ip -_id');

        res.status(200).json({
            success: true,
            message: 'Data retrieved successfully',
            data: { entries, customer },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching session data',
            error: error.message,
        });
    }
};

// Update session data
exports.updateSessionData = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const existingEntry = await GuestCardMood.findById(id);
        if (!existingEntry) {
            return res.status(404).json({
                message: 'Session data not found',
            });
        }

        const updatedEntry = await GuestCardMood.findByIdAndUpdate(id, updatedData, { new: true });

        res.status(200).json({
            message: 'Session data updated successfully',
            data: updatedEntry,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error updating session data',
            error: error.message,
        });
    }
};

// Delete session data
exports.deleteSessionData = async (req, res) => {
    try {
        const { id } = req.params;

        const existingEntry = await GuestCardMood.findById(id);
        if (!existingEntry) {
            return res.status(404).json({
                message: 'Session data not found',
            });
        }

        await GuestCardMood.findByIdAndDelete(id);

        res.status(200).json({
            message: 'Session data deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error deleting session data',
            error: error.message,
        });
    }
};
