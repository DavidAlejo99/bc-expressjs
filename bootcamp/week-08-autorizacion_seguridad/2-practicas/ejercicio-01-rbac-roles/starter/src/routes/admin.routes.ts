import { Router } from 'express';
import { listUsers, getStats } from '../controllers/admin.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/requireRole.js';

const router: Router = Router();

router.use(authMiddleware);
router.use(requireRole('admin'));

router.get('/users', listUsers);
router.get('/stats', getStats);

export default router;
