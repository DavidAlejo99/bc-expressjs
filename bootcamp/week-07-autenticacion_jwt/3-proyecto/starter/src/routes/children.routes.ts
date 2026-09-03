import { Router } from 'express';
import * as childrenController from '../controllers/children.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router: Router = Router();

router.use(authMiddleware);

router.get('/', childrenController.getAll);
router.get('/:id', childrenController.getById);
router.post('/', childrenController.create);
router.patch('/:id', childrenController.update);
router.delete('/:id', childrenController.remove);

export default router;
