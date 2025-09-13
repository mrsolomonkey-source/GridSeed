import { Router } from 'express';
import { register, login, refresh } from '../controllers/authController';
import { body } from 'express-validator';

const router = Router();

router.post(
  '/register',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  register
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  login
);

router.post('/refresh', refresh);

export default router;