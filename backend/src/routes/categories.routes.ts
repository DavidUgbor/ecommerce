import { Router } from 'express';
import * as productsController from '../controllers/products.controller';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', productsController.getCategories);
router.post('/', authenticate, requireAdmin, productsController.createCategory);

export default router;
