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
        }));

        // Send response with the order details
        return res.status(200).json(orderDetails);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving orders', error: error.message });
    }
};


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