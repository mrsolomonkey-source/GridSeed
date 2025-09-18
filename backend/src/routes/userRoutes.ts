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

const router = Router();

/**
 * ============================
 * USER ROUTES
 * ============================
 * This router handles all user-related endpoints:
 * - Management endpoints (CRUD on any user) → require "manage_users"
 * - Self-service endpoints (/me) → require authentication only
 * - Role exposure for frontend apps
 * - Input validation with express-validator
 * - Authentication & capability-based authorization
 */

/**
 * @route   GET /api/users
 * @desc    Fetch all users with optional pagination, filtering, and search
 * @access  Requires "manage_users"
 */
router.get(
  '/',
  authenticate,
  authorize(['manage_users']),
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
    query('role').optional().isString().withMessage('Role must be a string'),
    query('search').optional().isString().withMessage('Search must be a string')
  ],
  getUsers
);

/**
 * @route   GET /api/users/me
 * @desc    Get the currently authenticated user's profile
 * @access  Authenticated users
 */
router.get(
  '/me', 
  authenticate, 
  getCurrentUser
);

/**
 * @route   GET /api/users/:id
 * @desc    Fetch a single user by ID
 * @access  Requires "manage_users"
 */
router.get(
  '/:id',
  authenticate,
  authorize(['manage_users']),
  [param('id').isMongoId().withMessage('Invalid user ID')],
  getUserById
);

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Requires "manage_users"
 */
router.post(
  '/',
  authenticate,
  authorize(['manage_users']),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isString().withMessage('Role must be a string')
  ],
  createUser
);

/**
 * @route   PUT /api/users/:id
 * @desc    Update an existing user by ID
 * @access  Requires "manage_users"
 */
router.put(
  '/:id',
  authenticate,
  authorize(['manage_users']),
  [
    param('id').isMongoId().withMessage('Invalid user ID'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Must be a valid email'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isString().withMessage('Role must be a string')
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
 * @access  Requires "manage_users"
 */
router.delete(
  '/:id',
  authenticate,
  authorize(['manage_users']),
  [param('id').isMongoId().withMessage('Invalid user ID')],
  deleteUser
);

/**
 * @route   GET /api/users/roles
 * @desc    Get all available user roles
 * @access  Requires "manage_users"
 */
router.get(
  '/roles',
  authenticate,
  authorize(['manage_users']),
  getUserRoles
);

export default router;
