import { Router } from 'express';
import * as reviewsController from '../controllers/reviews.controller';
import { authenticate } from '../middleware/auth';
import { reviewValidator } from '../utils/validators';

const router = Router();

router.post('/', authenticate, reviewValidator, reviewsController.createReview);

export default router;
