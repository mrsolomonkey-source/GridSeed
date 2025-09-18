import { Router } from 'express';
import {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateUser,
  updateSelf,
  deleteUser,
  getUserRoles
} from '../controllers/userController';
import { body, param, query } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types/user';

const router = Router();

/**
 * ============================
 * USER ROUTES
 * ============================
 * This router handles all user-related endpoints:
 * - Admin-only management (CRUD on any user)
 * - Self-service endpoints (/me)
 * - Role exposure for frontend apps
 * - Input validation with express-validator
 * - Authentication & role-based authorization
 */

/**
 * @route   GET /api/users
 * @desc    Fetch all users with optional pagination, filtering, and search
 * @access  Admin only
 * @query   page, limit, role, search
 */
router.get(
  '/',
  authenticate,
  authorize(UserRole.Admin),
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
    query('role').optional().isIn(Object.values(UserRole)).withMessage('Invalid role'),
    query('search').optional().isString().withMessage('Search must be a string')
  ],
  getUsers
);

/**
 * @route   GET /api/users/me
 * @desc    Get the currently authenticated user's profile
 * @access  Authenticated users
 */
router.get('/me', authenticate, getCurrentUser);

/**
 * @route   GET /api/users/:id
 * @desc    Fetch a single user by ID
 * @access  Admin only
 */
router.get(
  '/:id',
  authenticate,
  authorize(UserRole.Admin),
  [param('id').isMongoId().withMessage('Invalid user ID')],
  getUserById
);

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Admin only
 */
router.post(
  '/',
  authenticate,
  authorize(UserRole.Admin),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(Object.values(UserRole)).withMessage('Invalid role')
  ],
  createUser
);

/**
 * @route   PUT /api/users/:id
 * @desc    Update an existing user by ID
 * @access  Admin only
 */
router.put(
  '/:id',
  authenticate,
  authorize(UserRole.Admin),
  [
    param('id').isMongoId().withMessage('Invalid user ID'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Must be a valid email'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(Object.values(UserRole)).withMessage('Invalid role')
  ],
  updateUser
);

/**
 * @route   PUT /api/users/me
 * @desc    Update the authenticated user's own profile
 * @access  Authenticated users
 * @note    Restricted: cannot change role or password here
 */
router.put(
  '/me',
  authenticate,
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Must be a valid email')
  ],
  updateSelf
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user by ID (soft delete recommended)
 * @access  Admin only
 */
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.Admin),
  [param('id').isMongoId().withMessage('Invalid user ID')],
  deleteUser
);

/**
 * @route   GET /api/users/roles
 * @desc    Get all available user roles
 * @access  Admin only
 */
router.get('/roles', authenticate, authorize(UserRole.Admin), getUserRoles);

export default router;
