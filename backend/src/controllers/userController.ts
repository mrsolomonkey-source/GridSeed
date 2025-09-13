import { Request, Response } from 'express';
import User from '../models/User';
import { hashPassword } from '../utils/hash';
import { validationResult } from 'express-validator';

// GET /api/users?search=&role=&sort=&page=&limit=
export const getUsers = async (req: Request, res: Response) => {
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

  res.json({ users, total, page: +page, pages: Math.ceil(total / +limit) });
};

// GET /api/users/:id
export const getUserById = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

// POST /api/users
export const createUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, role } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already in use' });

  const hashed = await hashPassword(password);
  const user = await User.create({ name, email, password: hashed, role });

  res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
};

// PUT /api/users/:id
export const updateUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;
  if (password) user.password = await hashPassword(password);

  await user.save();
  res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
};

// DELETE /api/users/:id
export const deleteUser = async (req: Request, res: Response) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted' });
};