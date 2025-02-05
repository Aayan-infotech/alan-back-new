const Stripe = require("stripe");
const Transaction = require("../models/TransactionModel");
const FinalOrder = require('../models/FinalOrder');
const CustomerManage = require('../models/CustMngModel');
const Order = require('../models/OrderModel');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
  try {
    const { checkoutData } = req.body;

    if (!checkoutData || !checkoutData.totalPrice || !checkoutData.totalProducts || !checkoutData.shippingMethod) {
      return res.status(400).json({ error: "Invalid checkout data." });
    }

    const totalPriceInPaise = Math.round(parseFloat(checkoutData.totalPrice) * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Total Purchase", description: `Total Products: ${checkoutData.totalProducts}` },
            unit_amount: totalPriceInPaise,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://44.196.64.110:2040/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "http://44.196.64.110:2040/cancel",
      metadata: {
        userId: checkoutData.userId,
        order_id: checkoutData.order_id,
        totalPrice: checkoutData.totalPrice,
        totalProducts: checkoutData.totalProducts,
      },
    });
    const transaction = new Transaction({
      userId: checkoutData.userId,
      order_id: checkoutData.order_id,
      amount: session.amount_total / 100, // Convert from paise to INR
      quantity: parseInt(session.metadata.totalProducts),
      currency: session.currency,
      paymentId: session.id,
      status: session.payment_status,
    });

    await transaction.save();


    res.json({ sessionId: session.id, session: session });    // Ensure only session.id is sent
  } catch (error) {
    console.error("Payment Processing Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// get all payment data and addres oder Detales
exports.getDataFromPaymentIntent = async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const userId = req.userId; // Extracted from verifyToken middleware

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Payment intent id is required!"
      });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Payment intent fetch failed!"
      });
    }

    // Fetch all orders for the given userId 
    const orders = await Order.find({ user_id: userId });
    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!"
      });
    }

    const finalOrders = [];

    for (const order of orders) {
      // Fetch Customer Details
      const customerData = await CustomerManage.findOne({ _id: order.user_id });
      if (!customerData) {
        return res.status(404).json({
          success: false,
          message: "Customer details not found!"
        });
      }

      // Create Final Order Entry
      const finalOrder = new FinalOrder({
        userId: userId,
        order_id: order._id,
        orderData: {
          product_name: order.name,
          product_sku: order.sku,
          product_price: order.product_price,
          total_price: order.totalPrice,
          selected_options: order.selectedOptions,
        },
        status: paymentIntent.status,
        paymentId: paymentIntent.id,
        quantity: 1, // Assuming 1 product per order, modify if needed
        amount: paymentIntent.amount / 100,
        payment_source: paymentIntent.payment_method,
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
      finalOrders.push(finalOrder);
    }

    res.status(200).json({
      success: true,
      paymentId: paymentIntent.id,
      status: paymentIntent.status,
      amountPaid: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      finalOrders
    });
  } catch (error) {
    console.log("Error fetching payment intent id:", error.message);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Internal server error",
      error: error.message
    });
  }
};


// const stripeSecretKey =
//   "sk_test_51QoJ7kAVVqxB4pCgCzCFxYLDXXT9c6C0Vesj55WqgBImj2I2GQemXbFAZYba4TarhpMkTkgXFDAXQT5JafUIn5Nn00U1fu6qrf";
// const stripe = Stripe(stripeSecretKey);
// const Stripe = require("stripe");
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// exports.createPaymentIntent = async (req, res) => {
//   try {
//     const { checkoutData } = req.body;

//     if (!checkoutData || !checkoutData.totalPrice || !checkoutData.totalProducts || !checkoutData.shippingMethod) {
//       return res.status(400).json({ error: "Invalid checkout data." });
//     }
//     const totalPriceInPaise = Math.round(parseFloat(checkoutData.totalPrice) * 100);
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "inr",
//             product_data: { name: "Total Purchase", description: `Total Products: ${checkoutData.totalProducts}` },
//             unit_amount: totalPriceInPaise,
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `http://44.196.64.110:2040/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: "http://44.196.64.110:2040/cancel",
//       metadata: {
//         userId: checkoutData.userId,
//         order_id: checkoutData.order_id,
//         totalPrice: checkoutData.totalPrice,
//         totalProducts: checkoutData.totalProducts,
//       },
//     });
//     res.json({ sessionId: session.id, session: session });
//   } catch (error) {
//     console.error("Payment Processing Error:", error.message);
//     res.status(500).json({ error: error.message });
//   }
// };


// process the payment intent
// exports.getDataFromPaymentIntent = async(req, res) => {
//   try{
//     const { paymentIntentId } = req.params;

//     if(!paymentIntentId){
//       return res.status(400).json({
//         success: false,
//         status: 400,
//         message: "Payment intent id is required!"
//       });
//     }

//     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

//     if(!paymentIntent){
//       return res.status(400).json({
//         success: false,
//         status: 400,
//         message: "Payment intent fetch failed!"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       paymentId: paymentIntent.id,
//       status: paymentIntent.status,
//       amountPaid: paymentIntent.amount / 100,
//       currency: paymentIntent.currency,
//       transactionDetails: paymentIntent,
//   });
//   }
//   catch(error){
//     cosnole.log("Error fetching payment intent id:", error.message);
//     return res.status(500).json({
//       success: false,
//       status: 500,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// }
