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

        const orderId = response.
        result.purchase_units[0].payments.captures[0];
        const TransactionData = await Transaction.find({ paymentId: response.result.id });
        const order = await Order.findById(TransactionData[0].order_id);
        console.log(111, order);

        if (!order) {
            console.error(`Order with ID ${orderId} not found`);
            return res.status(404).json({ message: 'Order not found' });
        }

        // Save transaction
        const transaction = new Transaction({
            userId: req.userId,
            order_id: order._id,
            // amount: response.result.purchase_units[0].amount.value,
            // // quantity: order.quantity || 1
            // currency: response.result.purchase_units[0].amount.currency_code,
            // paymentId: response.result.id,
            // status: response.result.status,
        });

        await transaction.save();
        res.json({ transaction });

    } catch (error) {
        console.error('Error executing payment:', error.message);
        res.status(500).json({ error: error.message });
    }
};

