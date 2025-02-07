const express = require('express');
const FinalOrder = require('../models/FinalOrderModel');

// Get All Orders
exports.getAllCustData = async (req, res) => {
    try {
        // Fetch all records from FinalOrder
        const orders = await FinalOrder.find();

        // Map the necessary fields
        const orderDetails = orders.map(order => ({
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
