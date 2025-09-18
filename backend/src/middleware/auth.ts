import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../types/user';
import { roleCapabilities, Capability } from '../config/rolesConfig';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Extend Express Request with user info
export interface AuthRequest extends Request {
  user?: { id: string; role: UserRole };
}

/**
 * 🔑 Authenticate Middleware
 * - Verifies JWT token
 * - Attaches decoded user (id + role) to req.user
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: UserRole };
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

/**
 * 🔒 Authorize Middleware
 * - Checks if the authenticated user has the required capabilities
 * - Usage: authorize(['manage_users']), authorize(['edit_content', 'view_reports'])
 */
export const authorize = (requiredCapabilities: Capability[] = []) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const userRole = req.user.role;
    // ✅ Explicitly type this as Capability[] to avoid `never[]` inference
    const userCapabilities: readonly Capability[] = roleCapabilities[userRole] ?? [];

    // Ensure user has ALL required capabilities
    const hasAll = requiredCapabilities.every((cap) =>
      userCapabilities.includes(cap)
    );

    if (!hasAll) {
      return res
        .status(403)
        .json({ success: false, message: 'Forbidden: insufficient permissions' });
    }

    next();
  };
};
