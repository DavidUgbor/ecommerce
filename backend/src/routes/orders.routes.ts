import { Router } from 'express';
import * as ordersController from '../controllers/orders.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, ordersController.createOrder);
router.get('/', authenticate, ordersController.getMyOrders);
router.get('/:id', authenticate, ordersController.getOrderById);
router.put('/:id/cancel', authenticate, ordersController.cancelOrder);

export default router;
