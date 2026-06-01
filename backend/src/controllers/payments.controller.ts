import { Request, Response } from 'express';
import Stripe from 'stripe';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16',
});

export const createPaymentIntent = async (req: AuthRequest, res: Response): Promise<void> => {
  const { amount, currency = 'usd' } = req.body;

  if (!amount || amount <= 0) throw createError('Invalid amount', 400);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    metadata: {
      userId: req.user!.userId,
    },
  });

  res.json({
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  });
};

export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    res.json({ received: true });
    return;
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch {
    res.status(400).json({ message: 'Webhook signature verification failed' });
    return;
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await prisma.order.updateMany({
        where: { paymentIntentId: paymentIntent.id },
        data: { paymentStatus: 'paid', status: 'CONFIRMED' },
      });
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await prisma.order.updateMany({
        where: { paymentIntentId: paymentIntent.id },
        data: { paymentStatus: 'failed' },
      });
      break;
    }
  }

  res.json({ received: true });
};
