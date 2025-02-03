const Stripe = require("stripe");

const stripeSecretKey =
  "sk_test_51QoJ7kAVVqxB4pCgCzCFxYLDXXT9c6C0Vesj55WqgBImj2I2GQemXbFAZYba4TarhpMkTkgXFDAXQT5JafUIn5Nn00U1fu6qrf";

const stripe = Stripe(stripeSecretKey);

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
    console.log(checkoutData.totalProducts, "total products");
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
      success_url:
        "http://44.196.64.110:2040/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://44.196.64.110:2040/cancel",
      metadata: {
        totalPrice: checkoutData.totalPrice,
        totalProducts: checkoutData.totalProducts,
      },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Payment Processing Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
