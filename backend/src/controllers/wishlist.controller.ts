import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

export const getWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  const items = await prisma.wishlistItem.findMany({
    where: { userId: req.user!.userId },
    include: {
      product: {
        include: {
          images: { orderBy: { order: 'asc' }, take: 1 },
          reviews: { select: { rating: true } },
          category: { select: { id: true, name: true, slug: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const itemsWithRating = items.map((item) => ({
    ...item,
    product: {
      ...item.product,
      avgRating:
        item.product.reviews.length > 0
          ? item.product.reviews.reduce((sum, r) => sum + r.rating, 0) / item.product.reviews.length
          : 0,
      reviewCount: item.product.reviews.length,
      reviews: undefined,
    },
  }));

  res.json(itemsWithRating);
};

export const addToWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  const { productId } = req.params;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.active) throw createError('Product not found', 404);

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId: req.user!.userId, productId } },
  });

  if (existing) {
    res.status(409).json({ message: 'Product already in wishlist' });
    return;
  }

  const item = await prisma.wishlistItem.create({
    data: { userId: req.user!.userId, productId },
    include: {
      product: {
        include: { images: { take: 1 }, category: { select: { id: true, name: true, slug: true } } },
      },
    },
  });

  res.status(201).json(item);
};

export const removeFromWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  const { productId } = req.params;

  const item = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId: req.user!.userId, productId } },
  });

  if (!item) throw createError('Item not in wishlist', 404);

  await prisma.wishlistItem.delete({
    where: { userId_productId: { userId: req.user!.userId, productId } },
  });

  res.json({ message: 'Removed from wishlist' });
};
