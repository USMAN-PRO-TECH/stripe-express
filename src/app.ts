import express from 'express';
import connectDB from './db.js';
import User from './models/User.js';
import Transaction , { ITransaction } from './models/Transaction.js';
import Stripe from 'stripe';

const app = express();
app.use(express.json());
connectDB();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2022-11-15' as any,
  });


 
  app.post('/create-checkout-session', async (req, res) => {
    try {
      const { userId, amount } = req.body;
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Payment for Order',
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:3000/cancel`,
        metadata: {
          userId,
        },
      });
      res.status(200).json({ url: session.url });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  });
  
  app.get('/success', async (req, res) => {
    const { session_id, transaction_id } = req.query;
  
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id as string);
  console.log('session', session)
  console.log('session.payment_status', session.payment_status)
      if (session.payment_status === 'paid') {
        await Transaction.findByIdAndUpdate(transaction_id, { status: 'completed' });
  
        res.send('Payment successful! You can now close this page.');
      } else {
        res.send('Payment not completed. Please try again.');
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  });
  
  app.get('/cancel', (req, res) => {
    res.send('Payment canceled. You can now close this page.');
  });
  


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
