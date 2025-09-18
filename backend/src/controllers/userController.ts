import { Request, Response } from 'express';
import User from '../models/User';
import { hashPassword } from '../utils/hash';
import { validationResult } from 'express-validator';
import { UserRole } from '../types/user';
import { roleCapabilities } from '../config/rolesConfig';

/**
 * Utility: handle validation errors consistently
 */
const handleValidationErrors = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return true;
  }
  return false;
};

/**
 * GET /api/users
 * Fetch all users with optional pagination, filtering, and search
 */
export const getUsers = async (req: Request, res: Response) => {
  try {
    const { search, role, sort = 'createdAt', page = 1, limit = 10 } = req.query;
    const query: any = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (role) query.role = role;

    const users = await User.find(query)
      .sort({ [sort as string]: 1 })
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .select('-password');

    const total = await User.countDocuments(query);

    // Attach capabilities dynamically
    const usersWithCaps = users.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      capabilities: roleCapabilities[u.role]
    }));

    res.json({
      success: true,
      data: { users: usersWithCaps, total, page: +page, pages: Math.ceil(total / +limit) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

/**
 * GET /api/users/me
 * Get the currently authenticated user's profile
 */
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        capabilities: roleCapabilities[user.role]
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

/**
 * GET /api/users/:id
 * Fetch a single user by ID
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        capabilities: roleCapabilities[user.role]
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

/**
 * POST /api/users
 * Create a new user
 */
export const createUser = async (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already in use' });

    const hashed = await hashPassword(password);
    const user = await User.create({ name, email, password: hashed, role });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        capabilities: roleCapabilities[user.role]
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

/**
 * PUT /api/users/:id
 * Update an existing user by ID
 */
export const updateUser = async (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const { name, email, password, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (password) user.password = await hashPassword(password);

    await user.save();
    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        capabilities: roleCapabilities[user.role]
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

/**
 * PUT /api/users/me
 * Update the authenticated user's own profile
 */
export const updateSelf = async (req: Request, res: Response) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const userId = (req as any).user?.id;
    const { name, email } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();
    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        capabilities: roleCapabilities[user.role]
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

/**
 * DELETE /api/users/:id
 * Delete a user by ID (soft delete recommended)
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

/**
 * GET /api/users/roles
 * Return all available roles
 */
export const getUserRoles = async (_req: Request, res: Response) => {
  try {
    res.json({ success: true, data: Object.values(UserRole) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};
