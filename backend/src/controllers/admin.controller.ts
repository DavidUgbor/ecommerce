import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getDashboardStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    revenueResult,
    recentOrders,
    lowStockProducts,
    ordersByStatus,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.product.count({ where: { active: true } }),
    prisma.order.count(),
    prisma.order.aggregate({
      where: { paymentStatus: 'paid' },
      _sum: { total: true },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { select: { quantity: true, price: true } },
      },
    }),
    prisma.product.findMany({
      where: { active: true, stock: { lte: 10 } },
      include: { images: { take: 1 }, category: { select: { name: true } } },
      orderBy: { stock: 'asc' },
      take: 10,
    }),
    prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
    }),
  ]);

  res.json({
    stats: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: revenueResult._sum.total || 0,
    },
    recentOrders,
    lowStockProducts,
    ordersByStatus: ordersByStatus.map((s) => ({ status: s.status, count: s._count.status })),
  });
};

export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  const { page = '1', limit = '20', search } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limitNum,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  res.json({
    users,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
};
