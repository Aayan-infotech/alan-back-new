const CustomerManage = require('../models/CustMngModel');
const Product = require('../models/ProductModel');
const mongoose = require('mongoose');
const Order = require("../models/OrderModel");

// POST API to create an order
// exports.createOrder = async (req, res) => {
//     // const imagePaths = req.fileLocations; :imagePaths
//     try {
//       const {
//         user_id,
//         totalPrice,
//         product_price,
//         product_id,
//         name,
//         sku,
//        images,
//         selectedOptions,
//         customDimensions,
//       } = req.body;

//       // Validate `user_id` in `CustomerManage`
//       const userExists = await CustomerManage.findById(user_id);
//       if (!userExists) {
//         return res.status(400).json({ message: "Invalid user_id" });
//       }

//       // Validate `product_id`, `name`, and `sku` in `Product`
//    /*   const productExists = await Product.findOne({
//         _id: product_id,
//         name: name,
//         sku: sku,
//       });
//       if (!productExists) {
//         return res.status(400).json({ message: "Invalid product details" });
//       } */

//       // Transform `selectedOptions` to only include level and name
//       const transformedOptions = Object.entries(selectedOptions).map(([level, details]) => ({
//         level,
//         name: details.name,
//       }));

//       // Prepare the order data
//       const newOrder = new Order({
//         user_id,
//         totalPrice,
//         product_price,
//         product_id,
//         name,
//         sku,
//         images,
//         selectedOptions: transformedOptions,
//         customDimensions,
//       });

//       // Save to the database
//       await newOrder.save();

//       res.status(201).json({
//         message: "Order created successfully",
//         order: newOrder,
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "An error occurred", error });
//     }
//   };


exports.createOrder = async (req, res) => {
    try {
        // Extract data from the request body
        const {
            user_id,
            totalPrice,
            product_price,
            product_id,
            name,
            sku,
            images,
            selectedOptions,
            customDimensions
        } = req.body;

        // Process selectedOptions to only store the 'name' and ignore 'value'
        const processedSelectedOptions = {};
        for (const [key, option] of Object.entries(selectedOptions)) {
            // Only store the 'name' field from each option (ignoring 'value')
            processedSelectedOptions[key] = option.name;
        }

        // Create a new order instance using the provided data
        const newOrder = new Order({
            user_id,
            totalPrice,
            product_price,
            product_id,
            name,
            sku,
            images,
            selectedOptions: processedSelectedOptions, // Only store 'name' from each selected option
            customDimensions,
        });

        // Save the new order to the database
        await newOrder.save();

        // Send a success response
        res.status(201).json({
            success: true,
            status: 200,
            message: 'Order created successfully!',
            order: newOrder,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            status: 500,
            message: 'Error creating order',
            error: error.message,
        });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const userId = req.userId;

        // Fetch the orders based on the user ID
        const orders = await Order.find({ user_id: userId });

        if (!orders.length) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'No orders found for this user',
                data: null
            });
        }

        // Fetch customer data,
        const customer = await CustomerManage.findById(userId).select('-password -otp -status -ins_ip -_id');

        if (!customer) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'Customer not found',
                data: null
            });
        }

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Data retrieved: orders and customer details successfully',
            data: { orders, customer }
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal server error',
            data: error.message
        });
    }
};

// Update Order
exports.updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const updatedData = req.body;

        // Check if the order exists
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                message: 'Order not found',
            });
        }

        // Update the order with new data
        const updatedOrder = await Order.findByIdAndUpdate(orderId, updatedData, { new: true });

        res.status(200).json({
            message: 'Order updated successfully',
            order: updatedOrder,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error updating order',
            error: error.message,
        });
    }
};

// Delete Order
exports.deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        // Check if the order exists
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                message: 'Order not found',
            });
        }

        // Delete the order
        await Order.findByIdAndDelete(orderId);

        res.status(200).json({
            message: 'Order deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error deleting order',
            error: error.message,
        });
    }
};