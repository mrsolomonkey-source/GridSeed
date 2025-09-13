import jwt from 'jsonwebtoken';
import { UserRole } from '../types/user';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

// Accepts any object with _id and role (e.g., IUserDocument)
export const generateToken = (user: { _id: any; role: UserRole }) =>
  jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

export const generateRefreshToken = (user: { _id: any }) =>
  jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

export const verifyToken = (token: string) =>
  jwt.verify(token, JWT_SECRET);

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, JWT_REFRESH_SECRET);