import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  const {
    page = '1',
    limit = '12',
    category,
    search,
    minPrice,
    maxPrice,
    sort = 'createdAt_desc',
    featured,
  } = req.query as Record<string, string>;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  const where: Record<string, unknown> = { active: true };

  if (category) {
    where.category = { slug: category };
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { tags: { contains: search } },
    ];
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) (where.price as Record<string, number>).gte = parseFloat(minPrice);
    if (maxPrice) (where.price as Record<string, number>).lte = parseFloat(maxPrice);
  }

  if (featured === 'true') {
    where.featured = true;
  }

  let orderBy: Record<string, string> = { createdAt: 'desc' };
  switch (sort) {
    case 'price_asc':
      orderBy = { price: 'asc' };
      break;
    case 'price_desc':
      orderBy = { price: 'desc' };
      break;
    case 'name_asc':
      orderBy = { name: 'asc' };
      break;
    case 'newest':
      orderBy = { createdAt: 'desc' };
      break;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limitNum,
      orderBy,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { order: 'asc' } },
        reviews: { select: { rating: true } },
        _count: { select: { reviews: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  const productsWithRating = products.map((p) => ({
    ...p,
    avgRating:
      p.reviews.length > 0
        ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
        : 0,
    reviewCount: p._count.reviews,
    reviews: undefined,
    _count: undefined,
  }));

  res.json({
    products: productsWithRating,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
};

export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { order: 'asc' } },
      variants: true,
      reviews: {
        include: {
          user: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      _count: { select: { reviews: true } },
    },
  });

  if (!product || !product.active) {
    throw createError('Product not found', 404);
  }

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

  res.json({ ...product, avgRating, reviewCount: product._count.reviews });
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const {
    name,
    description,
    price,
    comparePrice,
    stock,
    sku,
    categoryId,
    tags,
    featured,
    variants,
  } = req.body;

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') +
    '-' + Date.now();

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price: parseFloat(price),
      comparePrice: comparePrice ? parseFloat(comparePrice) : null,
      stock: parseInt(stock),
      sku: sku || null,
      categoryId,
      tags: tags || '',
      featured: featured === true || featured === 'true',
      variants: variants
        ? {
            create: (Array.isArray(variants) ? variants : JSON.parse(variants)).map(
              (v: { type: string; value: string; stock: number; priceModifier: number }) => ({
                type: v.type,
                value: v.value,
                stock: v.stock || 0,
                priceModifier: v.priceModifier || 0,
              })
            ),
          }
        : undefined,
    },
    include: {
      category: true,
      images: true,
      variants: true,
    },
  });

  res.status(201).json(product);
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw createError('Product not found', 404);

  const {
    name,
    description,
    price,
    comparePrice,
    stock,
    sku,
    categoryId,
    tags,
    featured,
    active,
  } = req.body;

  const updateData: Record<string, unknown> = {};
  if (name !== undefined) {
    updateData.name = name;
    updateData.slug =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' + Date.now();
  }
  if (description !== undefined) updateData.description = description;
  if (price !== undefined) updateData.price = parseFloat(price);
  if (comparePrice !== undefined)
    updateData.comparePrice = comparePrice ? parseFloat(comparePrice) : null;
  if (stock !== undefined) updateData.stock = parseInt(stock);
  if (sku !== undefined) updateData.sku = sku || null;
  if (categoryId !== undefined) updateData.categoryId = categoryId;
  if (tags !== undefined) updateData.tags = tags;
  if (featured !== undefined) updateData.featured = featured === true || featured === 'true';
  if (active !== undefined) updateData.active = active === true || active === 'true';

  const product = await prisma.product.update({
    where: { id },
    data: updateData,
    include: { category: true, images: true, variants: true },
  });

  res.json(product);
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw createError('Product not found', 404);

  await prisma.product.update({ where: { id }, data: { active: false } });
  res.json({ message: 'Product deactivated successfully' });
};

export const uploadProductImages = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw createError('Product not found', 404);

  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    res.status(400).json({ message: 'No files uploaded' });
    return;
  }

  const existingCount = await prisma.productImage.count({ where: { productId: id } });

  const images = await prisma.$transaction(
    files.map((file, index) =>
      prisma.productImage.create({
        data: {
          productId: id,
          url: `/uploads/${file.filename}`,
          alt: product.name,
          order: existingCount + index,
        },
      })
    )
  );

  res.status(201).json(images);
};

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: { where: { active: true } } } } },
    orderBy: { name: 'asc' },
  });
  res.json(categories);
};

export const createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, description } = req.body;

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const category = await prisma.category.create({
    data: { name, slug, description, image: req.body.image },
  });

  res.status(201).json(category);
};
