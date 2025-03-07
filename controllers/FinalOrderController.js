const express = require('express');
const FinalOrder = require('../models/FinalOrderModel');
const mongoose = require('mongoose');

//wab api 
exports.getOrdersByUserId = async (req, res) => {
    try {
        const userId = req.userId; // Extracted from verifyToken middleware

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const orders = await FinalOrder.find({ userId });

        if (!orders.length) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'No orders found for this user',
                data: []
            });
        }

        res.status(200).json({
            status: 200,
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Server Error',
            data: []
        });
    }
};


// Get All Orders
exports.getAllCustData = async (req, res) => {
    try {
        // Fetch all records from FinalOrder
        const orders = await FinalOrder.find();

        // Map the necessary fields
        const orderDetails = orders.map(order => ({
            id: order._id,
            order_id: order.order_id,
            productName: order.orderData.product_name, // Product name
            product_price: order.orderData.product_price, // Product price
            totalPrice: order.orderData.total_price, // Total price
            productSku: order.orderData.product_sku, // Product SKU
            selectedOptions: order.orderData.selected_options, // Selected options

            paymentId: order.paymentId, // Payment ID
            paidAmount: order.amount, // Amount paid
            paymentStatus: order.status, // Payment status

            quantity: order.quantity, // Quantity ordered
            orderStatus: order.orderStatus, // Order status
            date: order.createdAt, // Date the order was created

            customerName: order.customerDetails.name, // Customer name
            customerEmail: order.customerDetails.email, // Customer email
            customerMobile: order.customerDetails.mobile, // Customer mobile
            customerAddress: order.customerDetails.address, // Customer address
            customerState: order.customerDetails.state, // Customer state
            customerZipCode: order.customerDetails.zipCode, // Customer zip code
            customerCountry: order.customerDetails.country_name || 'Unknown', // Customer country (fallback to 'Unknown' if not available)
            trackId: order.trackId || '',
            trackPartner: order.trackPartner || ''
        }));

        // Send response with the order details
        return res.status(200).json(orderDetails);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving orders', error: error.message });
    }
};

// exports.getAllCustData = async (req, res) => {
//     try {
//         const orders = await FinalOrder.find();

//         // Create a map to group data by paymentId
//         const paymentGroupedOrders = new Map();

//         orders.forEach(order => {
//             const key = order.paymentId;

//             const productDetails = {
//                 order_id: order.order_id,
//                 productName: order.orderData.product_name,
//                 product_price: order.orderData.product_price,
//                 productSku: order.orderData.product_sku,
//                 selectedOptions: order.orderData.selected_options,
//                 date: order.createdAt
//             };

//             if (!paymentGroupedOrders.has(key)) {
//                 // Create a new entry for this paymentId
//                 paymentGroupedOrders.set(key, {
//                     id: order._id,
//                     paymentId: order.paymentId,
//                     paidAmount: order.amount,
//                     paymentStatus: order.status,
//                     totalPrice: order.orderData.total_price,
//                     quantity: order.quantity,
//                     orderStatus: order.orderStatus,

//                     customerName: order.customerDetails.name,
//                     customerEmail: order.customerDetails.email,
//                     customerMobile: order.customerDetails.mobile,
//                     customerAddress: order.customerDetails.address,
//                     customerState: order.customerDetails.state,
//                     customerZipCode: order.customerDetails.zipCode,
//                     customerCountry: order.customerDetails.country_name || 'Unknown',

//                     order_id: [productDetails.order_id].flat(), // Merge order IDs
//                     productName: [productDetails.productName].flat(), // Merge product names
//                     product_price: [productDetails.product_price].flat(), // Merge product prices
//                     productSku: [productDetails.productSku].flat(), // Merge product SKUs
//                     selectedOptions: [productDetails.selectedOptions].flat(), // Merge selected options
//                     date: [productDetails.date].flat() // Merge dates
//                 });
//             } else {
//                 // Merge order details into existing paymentId entry
//                 const existingEntry = paymentGroupedOrders.get(key);
//                 existingEntry.order_id.push(productDetails.order_id);
//                 existingEntry.productName.push(productDetails.productName);
//                 existingEntry.product_price.push(productDetails.product_price);
//                 existingEntry.productSku.push(productDetails.productSku);
//                 existingEntry.selectedOptions.push(productDetails.selectedOptions);
//                 existingEntry.date.push(productDetails.date);

//                 paymentGroupedOrders.set(key, existingEntry);
//             }
//         });

//         // Convert map values to array
//         const groupedOrders = Array.from(paymentGroupedOrders.values());

//         return res.status(200).json(groupedOrders);
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Error retrieving orders', error: error.message });
//     }
// };




exports.editFinalOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Order ID' });
        }

        // Find and update the FinalOrder by _id
        const updatedOrder = await FinalOrder.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order updated successfully', data: updatedOrder });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// OrderTracking
exports.trackOrder = async (req, res) => {
    try {
        const { order_id } = req.params; // Get order_id from request params

        if (!order_id) {
            return res.status(400).json({
                success: false,
                message: 'Order ID is required'
            });
        }

        // Validate if order_id is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(order_id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Order ID format'
            });
        }
        
        // Find the order by order_id
        const order = await FinalOrder.findOne({ order_id });

        if (!order) {
            return res.status(200).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order details retrieved successfully',
            data: {
                userId: order.userId,
                order_id: order.order_id,
                date: order.createdAt,
                orderStatus: order.orderStatus
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};