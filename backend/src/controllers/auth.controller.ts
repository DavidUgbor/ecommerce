import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import prisma from '../config/database';
import { signToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

export const register = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password, name, phone } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ message: 'Email already registered' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name, phone },
    select: { id: true, email: true, name: true, role: true, phone: true, createdAt: true },
  });

  const token = signToken({ userId: user.id, email: user.email, role: user.role });
  res.status(201).json({ token, user });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  const token = signToken({ userId: user.id, email: user.email, role: user.role });
  const { password: _pw, ...userWithoutPassword } = user;
  res.json({ token, user: userWithoutPassword });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
      createdAt: true,
      addresses: true,
    },
  });

  if (!user) {
    throw createError('User not found', 404);
  }

  res.json(user);
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, phone, currentPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  if (!user) throw createError('User not found', 404);

  const updateData: { name?: string; phone?: string; password?: string } = {};
  if (name) updateData.name = name;
  if (phone) updateData.phone = phone;

  if (newPassword && currentPassword) {
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Current password is incorrect' });
      return;
    }
    updateData.password = await bcrypt.hash(newPassword, 10);
  }

  const updated = await prisma.user.update({
    where: { id: req.user!.userId },
    data: updateData,
    select: { id: true, email: true, name: true, role: true, phone: true, createdAt: true },
  });

  res.json(updated);
};

export const addAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  const { fullName, phone, street, city, state, country, zipCode, isDefault } = req.body;

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: req.user!.userId },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: {
      userId: req.user!.userId,
      fullName,
      phone,
      street,
      city,
      state,
      country: country || 'Nigeria',
      zipCode,
      isDefault: isDefault || false,
    },
  });

  res.status(201).json(address);
};

export const updateAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { fullName, phone, street, city, state, country, zipCode, isDefault } = req.body;

  const address = await prisma.address.findFirst({
    where: { id, userId: req.user!.userId },
  });

  if (!address) throw createError('Address not found', 404);

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: req.user!.userId },
      data: { isDefault: false },
    });
  }

  const updated = await prisma.address.update({
    where: { id },
    data: { fullName, phone, street, city, state, country, zipCode, isDefault },
  });

  res.json(updated);
};

export const deleteAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const address = await prisma.address.findFirst({
    where: { id, userId: req.user!.userId },
  });

  if (!address) throw createError('Address not found', 404);

  await prisma.address.delete({ where: { id } });
  res.json({ message: 'Address deleted successfully' });
};
