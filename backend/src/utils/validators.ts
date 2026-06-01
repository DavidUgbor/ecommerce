import { body, param, query } from 'express-validator';

export const registerValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').trim().notEmpty().withMessage('Name is required'),
];

export const loginValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const productValidator = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price required'),
  body('stock').isInt({ min: 0 }).withMessage('Valid stock required'),
  body('categoryId').notEmpty().withMessage('Category is required'),
];

export const reviewValidator = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('productId').notEmpty().withMessage('Product ID is required'),
];

export const orderValidator = [
  body('addressId').notEmpty().withMessage('Address is required'),
];
