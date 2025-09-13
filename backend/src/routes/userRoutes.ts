import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { body } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types/user';

const router = Router();

router.get('/', authenticate, authorize(UserRole.Admin), getUsers);
router.get('/:id', authenticate, authorize(UserRole.Admin), getUserById);

router.post(
  '/',
  authenticate,
  authorize(UserRole.Admin),
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(Object.values(UserRole)),
  ],
  createUser
);

router.put(
  '/:id',
  authenticate,
  authorize(UserRole.Admin),
  [
    body('name').optional().notEmpty(),
    body('email').optional().isEmail(),
    body('password').optional().isLength({ min: 6 }),
    body('role').optional().isIn(Object.values(UserRole)),
  ],
  updateUser
);

router.delete('/:id', authenticate, authorize(UserRole.Admin), deleteUser);

export default router;