import { Router } from 'express';
import { getAll, getById, create, update, remove } from '../controllers/children.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/requireRole.js';

const router: Router = Router();

// Todo el recurso Child requiere autenticación — no hay datos públicos de niños
router.use(authMiddleware);

router.get('/', getAll);
router.get('/:id', getById);

// Crear: cualquier staff o admin autenticado
router.post('/', create);

// Actualizar: dueño del registro o admin (verificado en el service)
router.patch('/:id', update);

// Eliminar: solo admin
router.delete('/:id', requireRole('admin'), remove);

export default router;
