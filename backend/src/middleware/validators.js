// middleware/validators.js
import { body } from 'express-validator';

// Regex for a strong password.
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const registerValidator = [
  body('name', 'Please provide a valid full name')
  .isLength({ min: 3 }) // Rule 1: At least 3 characters long
  .withMessage('Name must be at least 3 characters long')
  .matches(/^[A-Za-z\s]+$/) // Rule 2: Only allows letters (upper/lower) and spaces
  .withMessage('Name must only contain letters and spaces')
  .trim()
  .escape(),
  
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  
  body('password', 'Password is not strong enough')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(strongPasswordRegex).withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (@$!%*?&)'),

  body('role', 'Role must be either lawyer or citizen').isIn(['lawyer', 'citizen']),
];

export const loginValidator = [
  body('email', 'Please include a valid email').isEmail().normalizeEmail(),
  body('password', 'Password is required').exists(),
  body('role', 'Role is required').not().isEmpty(),
];