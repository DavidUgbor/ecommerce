import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `LG-${timestamp}-${random}`;
};

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  const { addressId, couponCode, paymentIntentId } = req.body;

  const address = await prisma.address.findFirst({
    where: { id: addressId, userId: req.user!.userId },
  });
  if (!address) throw createError('Address not found', 404);

  const cart = await prisma.cart.findUnique({
    where: { userId: req.user!.userId },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) throw createError('Cart is empty', 400);

  let subtotal = 0;
  const orderItems = [];

  for (const item of cart.items) {
    if (!item.product.active) throw createError(`${item.product.name} is no longer available`, 400);
    if (item.product.stock < item.quantity) {
      throw createError(`Insufficient stock for ${item.product.name}`, 400);
    }

    const price = item.product.price + (item.variant?.priceModifier || 0);
    subtotal += price * item.quantity;

    orderItems.push({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      price,
      productName: item.product.name,
      productImage: null as string | null,
    });
  }

  let discount = 0;
  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
    if (coupon && coupon.active) {
      const now = new Date();
      if (!coupon.expiresAt || coupon.expiresAt > now) {
        if (!coupon.minOrder || subtotal >= coupon.minOrder) {
          if (!coupon.maxUses || coupon.usedCount < coupon.maxUses) {
            if (coupon.type === 'PERCENT') {
              discount = (subtotal * coupon.value) / 100;
            } else {
              discount = coupon.value;
            }
            await prisma.coupon.update({
              where: { code: couponCode.toUpperCase() },
              data: { usedCount: { increment: 1 } },
            });
          }
        }
      }
    }
  }

  const shipping = subtotal > 150 ? 0 : 15;
  const tax = (subtotal - discount) * 0.075;
  const total = subtotal - discount + shipping + tax;

  const order = await prisma.order.create({
    data: {
      userId: req.user!.userId,
      orderNumber: generateOrderNumber(),
      status: 'PENDING',
      total,
      subtotal,
      shipping,
      tax,
      discount,
      addressId,
      paymentIntentId: paymentIntentId || null,
      paymentStatus: paymentIntentId ? 'paid' : 'pending',
      couponCode: couponCode || null,
      items: {
        create: orderItems,
      },
    },
    include: {
      items: { include: { product: { include: { images: { take: 1 } } }, variant: true } },
      address: true,
    },
  });

  // Reduce stock
  await Promise.all(
    cart.items.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    )
  );

  // Update product images in order items
  await Promise.all(
    order.items.map((item) => {
      const imageUrl = item.product.images?.[0]?.url || null;
      if (imageUrl) {
        return prisma.orderItem.update({
          where: { id: item.id },
          data: { productImage: imageUrl },
        });
      }
      return Promise.resolve();
    })
  );

  // Clear cart
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  res.status(201).json(order);
};

export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user!.userId },
    include: {
      items: { include: { product: { include: { images: { take: 1 } } }, variant: true } },
      address: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(orders);
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const order = await prisma.order.findFirst({
    where: { id, userId: req.user!.userId },
    include: {
      items: { include: { product: { include: { images: { take: 1 } } }, variant: true } },
      address: true,
    },
  });

  if (!order) throw createError('Order not found', 404);
  res.json(order);
};

export const cancelOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const order = await prisma.order.findFirst({
    where: { id, userId: req.user!.userId },
    include: { items: true },
  });

  if (!order) throw createError('Order not found', 404);

  if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
    throw createError('Order cannot be cancelled at this stage', 400);
  }

  await prisma.order.update({ where: { id }, data: { status: 'CANCELLED' } });

  // Restore stock
  await Promise.all(
    order.items.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      })
    )
  );

  res.json({ message: 'Order cancelled successfully' });
};

// Admin controllers
export const adminGetOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  const { page = '1', limit = '20', status } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limitNum,
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: true,
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.count({ where }),
  ]);

  res.json({
    orders,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
};

export const adminUpdateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];
  if (!validStatuses.includes(status)) throw createError('Invalid status', 400);

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw createError('Order not found', 404);

  const updated = await prisma.order.update({
    where: { id },
    data: { status, updatedAt: new Date() },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: true,
      address: true,
    },
  });

  res.json(updated);
};
