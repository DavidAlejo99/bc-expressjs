import { Router } from 'express';
import { parentsController } from '../controllers/parents.controller';

export const parentsRouter = Router();

parentsRouter.get('/', parentsController.getAll);
parentsRouter.get('/:id', parentsController.getById);
parentsRouter.post('/', parentsController.create);
parentsRouter.put('/:id', parentsController.update);
parentsRouter.delete('/:id', parentsController.remove);