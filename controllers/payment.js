const Stripe = require('stripe');

const stripeSecretKey = 'sk_test_51PqTR903ec58RCFWb7qYStr1sxR9wKpUWfu4hq1MFhfMRVidxNBoO3aCYWAOJmkpN5lKTBE2RRMB2pSU574ame9F00Vr3gCarb';

const stripe = Stripe(stripeSecretKey);

exports.createPaymentIntent = async (req, res) => {
  try {
    const { products } = req.body;

    const lineItems = products.map((product) => ({
      price_data: {
        currency: 'inr',
        product_data: { name: product.dish, images: [product.imgdata] },
        unit_amount: product.price * 100,
      },
      quantity: product.qnty,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Payment Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};
