const Stripe = require("stripe");
const Transaction = require("../models/TransactionModel");
const FinalOrder = require("../models/FinalOrderModel");
const CustomerManage = require("../models/CustMngModel");
const Order = require("../models/OrderModel");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
  try {
    const { checkoutData } = req.body;
    if (
      !checkoutData ||
      !checkoutData.totalPrice ||
      !checkoutData.totalProducts ||
      !checkoutData.shippingMethod
    ) {
      return res.status(400).json({ error: "Invalid checkout data." });
    }
    const totalPriceInPaise = Math.round(
      parseFloat(checkoutData.totalPrice) * 100
    );
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Total Purchase",
              description: `Total Products: ${checkoutData.totalProducts}`,
            },
            unit_amount: totalPriceInPaise,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // success_url: "http://44.196.64.110:2040//successfull?session_id={CHECKOUT_SESSION_ID}",
      // cancel_url: "http://44.196.64.110:2040//cancel",
      success_url: `${process.env.ROUTE_BASE_URL}/thanku?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.ROUTE_BASE_URL}/cancel`,
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
      amount: session.amount_total / 100,
      quantity: parseInt(session.metadata.totalProducts),
      currency: session.currency,
      paymentId: session.id,
      status: session.payment_status,
    });
    await transaction.save();
    res.json({ sessionId: session.id, session: session });
  } catch (error) {
    console.error("Payment Processing Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.completePayment = async (req, res) => { 
  try {
    const sessionId = req.query.session_id;
    const [session, lineItems] = await Promise.all([
      stripe.checkout.sessions.retrieve(sessionId, { expand: ['payment_intent.payment_method'] }),
      stripe.checkout.sessions.listLineItems(sessionId)
    ]);
    if (!session || session.payment_status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment not successful!",
      });
    }
    const userId = req.userId;
    const { order_id, totalPrice, totalProducts } = session.metadata || {};
    const paymentIntent = session.payment_intent || {};
    const paymentMethod = paymentIntent.payment_method || {};
    const cardDetails = paymentMethod.card || {};
    const query = { user_id: userId };
    if (order_id) query._id = order_id;
    const orders = await Order.find(query);
    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }``
    const finalOrders = [];
    for (const order of orders) {
      const customerData = await CustomerManage.findOne({ _id: order.user_id });
      if (!customerData) {
        return res.status(404).json({
          success: false,
          message: "Customer details not found!",
        });
      }
      const finalOrder = new FinalOrder({
        userId,
        order_id: order._id,
        orderData: {
          product_name: order.name || "Unknown",
          product_sku: order.sku || "Unknown",
          product_price: order.product_price || 0,
          total_price: order.totalPrice,
          selected_options: order.selectedOptions,
        },
        status: paymentIntent.status || "Unknown",
        paymentId: paymentIntent.id || "N/A",
        quantity: totalProducts || 1,
        amount: (paymentIntent.amount || 0) / 100,
        payment_source: paymentMethod,
        customerDetails: {
          name: customerData.name,
          email: customerData.email,
          mobile: customerData.mobile,
          address: customerData.address,
          state: customerData.state,
          zipCode: customerData.zipCode,
          country_name: customerData.country_name,
        },
        payer: {
          card: {
            brand: cardDetails.brand || "Unknown",
            number: cardDetails.last4 ? `**** **** **** ${cardDetails.last4}` : "N/A",
          },
          email: session.customer_details?.email || "N/A",
          name: session.customer_details?.name || "N/A",
          phone: session.customer_details?.phone || "N/A",
        },
      });

      await finalOrder.save();
      finalOrders.push(finalOrder);
      await Order.findByIdAndDelete(order._id);
    }
    res.status(200).json({ 
      success: true,
      message: "Payment completed successfully! Orders moved to FinalOrder and removed from OrderModel.",
      orders: finalOrders,
    });
  } catch (error) {
    console.error("Error in completing the payment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

