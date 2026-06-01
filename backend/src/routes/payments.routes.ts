import { Router } from 'express';
import * as paymentsController from '../controllers/payments.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/create-intent', authenticate, paymentsController.createPaymentIntent);
router.post('/webhook', paymentsController.handleWebhook);

export default router;
