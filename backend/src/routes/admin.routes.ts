import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import * as ordersController from '../controllers/orders.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/dashboard', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);
router.get('/orders', ordersController.adminGetOrders);
router.put('/orders/:id/status', ordersController.adminUpdateOrderStatus);

export default router;
