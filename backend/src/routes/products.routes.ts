import { Router } from 'express';
import * as productsController from '../controllers/products.controller';
import * as reviewsController from '../controllers/reviews.controller';
import { authenticate, requireAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { productValidator, reviewValidator } from '../utils/validators';

const router = Router();

router.get('/', productsController.getProducts);
router.get('/categories', productsController.getCategories);
router.get('/:slug', productsController.getProductBySlug);
router.get('/:id/reviews', reviewsController.getProductReviews);

router.post('/', authenticate, requireAdmin, productValidator, productsController.createProduct);
router.put('/:id', authenticate, requireAdmin, productsController.updateProduct);
router.delete('/:id', authenticate, requireAdmin, productsController.deleteProduct);
router.post('/:id/images', authenticate, requireAdmin, upload.array('images', 10), productsController.uploadProductImages);

router.post('/categories', authenticate, requireAdmin, productsController.createCategory);

export default router;
