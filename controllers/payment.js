// const Stripe = require("stripe");
// const Transaction = require("../models/TransactionModel");

// // const stripeSecretKey =
// //   "sk_test_51QoJ7kAVVqxB4pCgCzCFxYLDXXT9c6C0Vesj55WqgBImj2I2GQemXbFAZYba4TarhpMkTkgXFDAXQT5JafUIn5Nn00U1fu6qrf";

// // const stripe = Stripe(stripeSecretKey);
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
//     const transaction = new Transaction({
//       userId: checkoutData.userId,
//       order_id: checkoutData.order_id,
//       amount: session.amount_total / 100, // Convert from paise to INR
//       quantity: parseInt(session.metadata.totalProducts),
//       currency: session.currency,
//       paymentId: session.id,
//       status: session.payment_status,
//     });

//     await transaction.save();


//     res.json({ sessionId: session.id, session: session });    // Ensure only session.id is sent
//   } catch (error) {
//     console.error("Payment Processing Error:", error.message);
//     res.status(500).json({ error: error.message });
//   }
// };



const Stripe = require("stripe");
const Transaction = require("../models/TransactionModel");

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

    let paymentId = session.payment_intent || session.id; // Fallback to session ID if payment_intent is null

    const transaction = new Transaction({
      userId: session.metadata.userId,
      order_id: session.metadata.order_id,
      amount: session.amount_total / 100, // Convert from paise to INR
      quantity: parseInt(session.metadata.totalProducts),
      currency: session.currency,
      paymentId: paymentId,
      status: session.payment_status,
    });

    await transaction.save();

    res.json({ sessionId: session.id, session });
  } catch (error) {
    console.error("Payment Processing Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
