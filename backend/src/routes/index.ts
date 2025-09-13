import { Router } from 'express';
import authRoutes from './authRoutes';
// import userRoutes from './userRoutes';
// import productRoutes from './productRoutes';
// import categoryRoutes from './categoryRoutes';
// import orderRoutes from './orderRoutes';
// import commentRoutes from './commentRoutes';

const router = Router();

router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/products', productRoutes);
// router.use('/categories', categoryRoutes);
// router.use('/orders', orderRoutes);
// router.use('/comments', commentRoutes);

router.get('/', (_req, res) => res.json({ message: 'API Root' }));

export default router;