import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const getOrCreateCart = async (userId: string) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: { images: { orderBy: { order: 'asc' }, take: 1 } },
          },
          variant: true,
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { images: { orderBy: { order: 'asc' }, take: 1 } },
            },
            variant: true,
          },
        },
      },
    });
  }

  return cart;
};

export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  const cart = await getOrCreateCart(req.user!.userId);
  res.json(cart);
};

export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  const { productId, variantId, quantity = 1 } = req.body;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.active) throw createError('Product not found', 404);

  const cart = await getOrCreateCart(req.user!.userId);

  const existingItem = cart.items.find(
    (item) => item.productId === productId && item.variantId === (variantId || null)
  );

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
        quantity,
      },
    });
  }

  const updatedCart = await getOrCreateCart(req.user!.userId);
  res.json(updatedCart);
};

export const updateCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) throw createError('Quantity must be at least 1', 400);

  const cart = await prisma.cart.findUnique({ where: { userId: req.user!.userId } });
  if (!cart) throw createError('Cart not found', 404);

  const item = await prisma.cartItem.findFirst({ where: { id, cartId: cart.id } });
  if (!item) throw createError('Cart item not found', 404);

  await prisma.cartItem.update({ where: { id }, data: { quantity } });

  const updatedCart = await getOrCreateCart(req.user!.userId);
  res.json(updatedCart);
};

export const removeCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const cart = await prisma.cart.findUnique({ where: { userId: req.user!.userId } });
  if (!cart) throw createError('Cart not found', 404);

  const item = await prisma.cartItem.findFirst({ where: { id, cartId: cart.id } });
  if (!item) throw createError('Cart item not found', 404);

  await prisma.cartItem.delete({ where: { id } });

  const updatedCart = await getOrCreateCart(req.user!.userId);
  res.json(updatedCart);
};

export const clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
  const cart = await prisma.cart.findUnique({ where: { userId: req.user!.userId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
  res.json({ message: 'Cart cleared' });
};
