import { Request, Response } from 'express';
import User from '../models/User';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken, generateRefreshToken } from '../utils/jwt';
import { UserRole } from '../types/user';

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already in use' });

  const hashed = await hashPassword(password);
  const user = await User.create({
    name,
    email,
    password: hashed,
    role: role || UserRole.Viewer,
  });

  res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const valid = await comparePassword(password, user.password);
  if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  res.json({
    token,
    refreshToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

export const refresh = async (req: Request, res: Response) => {
  // Implement refresh logic here (see utils/jwt.ts)
  res.status(501).json({ message: 'Not implemented' });
};