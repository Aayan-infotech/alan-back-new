// const paypal = require('@paypal/checkout-server-sdk');
// const Transaction = require('../models/TransactionModel');
// const CustomerManage = require('../models/CustMngModel');
// const Order = require('../models/OrderModel');

// // PayPal environment setup
// let environment = new paypal.core.SandboxEnvironment(
//     process.env.PAYPAL_CLIENT_ID,
//     process.env.PAYPAL_CLIENT_SECRET
// );
// let client = new paypal.core.PayPalHttpClient(environment);

// exports.createPayment = async (req, res) => {
//     const { orderId, amount, currency } = req.body;

//     try {

//         const order = await Order.findById(orderId);
//         if (!order) return res.status(404).json({ message: 'Order not found' });

//         // Create a PayPal order
//         const request = new paypal.orders.OrdersCreateRequest();
//         request.prefer("return=representation");
//         request.requestBody({
//             intent: 'CAPTURE',
//             purchase_units: [{
//                 amount: {
//                     currency_code: currency,
//                     value: amount
//                 },
//                 custom_id: orderId, 
//                 description: `Payment for order ${orderId}`
//             }],
//             application_context: {
//                 return_url: 'http://localhost:7878/api/transaction/execute-payment', // Return URL after approval
//                 cancel_url: 'http://localhost:7878/api/transaction/cancel-payment' // URL for canceling the payment
//             }
//         });

//         // Execute the request
//         const response = await client.execute(request);

//         // Extract the approval URL and send it to the frontend
//         const approvalUrl = response.result.links.find(link => link.rel === 'approve').href;

//         // Save the created order details in the Transaction model
//         const newTransaction = new Transaction({
//             userId: req.userId, // Assuming the user ID is available in the request
//             order_id: orderId,
//             amount: amount,
//             quantity: order.quantity, // Fetching quantity from the order
//             currency: currency,
//             paymentId: response.result.id, // PayPal order ID
//             status: 'CREATED' // Status before capture
//         });

//         await newTransaction.save();

//         res.json({ approvalUrl, transaction: newTransaction });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.executePayment = async (req, res) => {
//     const { paymentId, PayerID } = req.query;  // Extract from query string

//     if (!paymentId || !PayerID) {
//         return res.status(400).json({ message: "Missing required query parameters" });
//     }

//     try {
//         // Capture the PayPal order
//         const request = new paypal.orders.OrdersCaptureRequest(paymentId);
//         request.requestBody({});
//         const response = await client.execute(request);

//         // Find the customer using the user ID from the token (JWT token)
//         const customer = await CustomerManage.findById(req.userId);
//         if (!customer) return res.status(404).json({ message: 'User not found' });

//         // Use the custom ID to find the order
//         const orderId = response.result.purchase_units[0].custom_id;
//         const order = await Order.findById(orderId);
//         if (!order) return res.status(404).json({ message: 'Order not found' });

//         // Save the transaction in the database
//         const newTransaction = new Transaction({
//             userId: customer._id,
//             order_id: order._id,
//             amount: response.result.purchase_units[0].amount.value,
//             quantity: order.quantity,
//             currency: response.result.purchase_units[0].amount.currency_code, // Added currency
//             paymentId: response.result.id,
//             status: response.result.status
//         });

//         await newTransaction.save();
//         res.json({ transaction: newTransaction });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: error.message });
//     }
// };

// ----------------------------------------

// const paypal = require('@paypal/checkout-server-sdk');
// const Transaction = require('../models/TransactionModel');
// const CustomerManage = require('../models/CustMngModel');
// const Order = require('../models/OrderModel');
const FinalOrder = require('../models/FinalOrderModel');
const paypal = require('@paypal/checkout-server-sdk');
const Transaction = require('../models/TransactionModel');
const CustomerManage = require('../models/CustMngModel');
const Order = require('../models/OrderModel');

// PayPal environment setup
const environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

exports.createPayment = async (req, res) => {
    const { orderId, amount, currency } = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            console.error(`Order with ID ${orderId} not found`);
            return res.status(404).json({ message: 'Order not found' });
        }

        // Create PayPal order
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: { currency_code: currency, value: amount },
                    custom_id: orderId,
                    description: `Payment for order ${orderId}`,
                },
            ],
            application_context: {
                return_url: 'http://localhost:7878/api/transaction/execute-payment',
                cancel_url: 'http://localhost:7878/api/transaction/cancel-payment',
            },
        });

        const response = await client.execute(request);
        const approvalUrl = response.result.links.find(link => link.rel === 'approve')?.href;

        if (!approvalUrl) {
            console.error('Approval URL not found in PayPal response');
            return res.status(500).json({ message: 'Unable to create PayPal order' });
        }

        // Save transaction
        const transaction = new Transaction({
            userId: req.userId,
            order_id: orderId,
            amount,
            quantity: order.quantity || 1, // Default to 1 if quantity is not available
            currency,
            paymentId: response.result.id,
            status: 'CREATED',
        });

        await transaction.save();
        res.json({ approvalUrl, transaction });

    } catch (error) {
        console.error('Error creating payment:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// exports.executePayment = async (req, res) => {
//     const { token, PayerID } = req.query; // Extract PayPal token as paymentId

//     try {
//         if (!token || !PayerID) {
//             console.error('Missing required query parameters:', req.query);
//             return res.status(400).json({ message: 'Missing required query parameters' });
//         }

//         // Capture the PayPal payment
//         const request = new paypal.orders.OrdersCaptureRequest(token);
//         request.requestBody({});
//         const response = await client.execute(request);

//         console.log("response", response);

//         const orderId = response.
//         result.purchase_units[0].payments.captures[0];
//         const TransactionData = await Transaction.find({ paymentId: response.result.id });

//         console.log("TransactionData", TransactionData);


//         const order = await Order.findById(TransactionData[0].order_id);
//         console.log("orderData", order);

//         if (!order) {
//             console.error(`Order with ID ${orderId} not found`);
//             return res.status(404).json({ message: 'Order not found' });
//         }

//         // Save transaction
//         const transaction = new Transaction({
//             userId: req.userId,
//             order_id: order._id,
            
//         });

//         await transaction.save();
//         res.json({ transaction });

//     } catch (error) {
//         console.error('Error executing payment:', error.message);
//         res.status(500).json({ error: error.message });
//     }
// };







// exports.executePayment = async (req, res) => {
//     const { token, PayerID } = req.query; // Extract PayPal token as paymentId

//     try {
//         if (!token || !PayerID) {
//             console.error('Missing required query parameters:', req.query);
//             return res.status(400).json({ message: 'Missing required query parameters' });
//         }

//         // Capture the PayPal payment
//         const request = new paypal.orders.OrdersCaptureRequest(token);
//         request.requestBody({});
//         const response = await client.execute(request);

//         console.log("response", response);

//         const capturedPayment = response.result;
//         const paymentId = capturedPayment.id;
//         const status = capturedPayment.status;
//         const payment_source = capturedPayment.payment_source;
//         const payer = capturedPayment.payer;
//         const purchaseUnit = capturedPayment.purchase_units[0];
//         const orderDetails = purchaseUnit.payments.captures[0];

//         // Retrieve the transaction details
//         const transactionData = await Transaction.findOne({ paymentId });
//         console.log("TransactionData", transactionData);

//         if (!transactionData) {
//             console.error(`Transaction with Payment ID ${paymentId} not found`);
//             return res.status(404).json({ message: 'Transaction not found' });
//         }

//         const order = await Order.findById(transactionData.order_id);
//         console.log("orderData", order);

//         if (!order) {
//             console.error(`Order with ID ${transactionData.order_id} not found`);
//             return res.status(404).json({ message: 'Order not found' });
//         }

//         // Save the final order to the database
//         const finalOrder = new FinalOrder({
//             userId: transactionData.userId,
//             order_id: order._id,
//             orderData: {
//                 product_name: order.name,
//                 product_sku: order.sku,
//                 product_price: order.product_price,
//                 total_price: order.totalPrice,
//                 selected_options: Object.fromEntries(order.selectedOptions),
//             },
//             status: status,
//             paymentId: paymentId,
//             quantity: transactionData.quantity,
//             amount: transactionData.amount,
//             payment_source: payment_source,
//             payer: {
//                 name: payer.name.full_name,
//                 email: payer.email_address,
//                 payer_id: payer.payer_id,
//             },
//         });

//         await finalOrder.save();

//         res.json({ message: 'Final order saved successfully', finalOrder });
//     } catch (error) {
//         console.error('Error executing payment:', error.message);
//         res.status(500).json({ error: error.message });
//     }
// };

exports.executePayment = async (req, res) => {
    const { token, PayerID } = req.query; // Extract PayPal token as paymentId

    try {
        if (!token || !PayerID) {
            console.error('Missing required query parameters:', req.query);
            return res.status(400).json({ message: 'Missing required query parameters' });
        }

        // Capture the PayPal payment
        const request = new paypal.orders.OrdersCaptureRequest(token);
        request.requestBody({});
        const response = await client.execute(request);

        console.log("response", response);

        const capturedPayment = response.result;
        const paymentId = capturedPayment.id;
        const status = capturedPayment.status;
        const payment_source = capturedPayment.payment_source;
        const payer = capturedPayment.payer;
        const purchaseUnit = capturedPayment.purchase_units[0];
        const orderDetails = purchaseUnit.payments.captures[0];

        // Retrieve the transaction details
        const transactionData = await Transaction.findOne({ paymentId });
        console.log("TransactionData", transactionData);

        if (!transactionData) {
            console.error(`Transaction with Payment ID ${paymentId} not found`);
            return res.status(404).json({ message: 'Transaction not found' });
        }

        const order = await Order.findById(transactionData.order_id);
        console.log("orderData", order);

        if (!order) {
            console.error(`Order with ID ${transactionData.order_id} not found`);
            return res.status(404).json({ message: 'Order not found' });
        }

        // Retrieve CustomerManage data
        const customerData = await CustomerManage.findById(transactionData.userId);
        if (!customerData) {
            console.error(`Customer with ID ${transactionData.userId} not found`);
            return res.status(404).json({ message: 'Customer not found' });
        }

        console.log("CustomerData", customerData);

        // Save the final order to the database
        const finalOrder = new FinalOrder({
            userId: transactionData.userId,
            order_id: order._id,
            orderData: {
                product_name: order.name,
                product_sku: order.sku,
                product_price: order.product_price,
                total_price: order.totalPrice,
                selected_options: Object.fromEntries(order.selectedOptions),
            },
            status: status,
            paymentId: paymentId,
            quantity: transactionData.quantity,
            amount: transactionData.amount,
            payment_source: payment_source,
            payer: {
                name: payer.name.full_name,
                email: payer.email_address,
                payer_id: payer.payer_id,
            },
            customerDetails: {
                name: customerData.name,
                email: customerData.email,
                mobile: customerData.mobile,
                address: customerData.address,
                state: customerData.state,
                zipCode: customerData.zipCode,
                country_name: customerData.country_name,
            },
        });

        await finalOrder.save();

        res.json({ message: 'Final order saved successfully', finalOrder });
    } catch (error) {
        console.error('Error executing payment:', error.message);
        res.status(500).json({ error: error.message });
    }
};