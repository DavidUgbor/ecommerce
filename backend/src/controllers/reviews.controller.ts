import { Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { productId, rating, title, body } = req.body;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.active) throw createError('Product not found', 404);

  const existingReview = await prisma.review.findUnique({
    where: { userId_productId: { userId: req.user!.userId, productId } },
  });
  if (existingReview) throw createError('You have already reviewed this product', 409);

  // Check if user purchased this product
  const hasPurchased = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: { userId: req.user!.userId, status: 'DELIVERED' },
    },
  });

  const review = await prisma.review.create({
    data: {
      userId: req.user!.userId,
      productId,
      rating: parseInt(rating),
      title: title || null,
      body: body || null,
      verified: !!hasPurchased,
    },
    include: {
      user: { select: { id: true, name: true } },
    },
  });

  res.status(201).json(review);
};

export const getProductReviews = async (req: AuthRequest | any, res: Response): Promise<void> => {
  const { id } = req.params;
  const { page = '1', limit = '10' } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { productId: id },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
    }),
    prisma.review.count({ where: { productId: id } }),
  ]);

  const avgRating =
    total > 0
      ? (await prisma.review.aggregate({ where: { productId: id }, _avg: { rating: true } }))
          ._avg.rating || 0
      : 0;

  res.json({
    reviews,
    avgRating: Math.round(avgRating * 10) / 10,
    total,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
};
