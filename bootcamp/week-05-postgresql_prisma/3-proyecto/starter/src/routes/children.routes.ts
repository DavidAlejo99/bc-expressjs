import { Router } from 'express';
import { childrenController } from '../controllers/children.controller';

export const childrenRouter = Router();

childrenRouter.get('/', childrenController.getAll);
childrenRouter.get('/:id', childrenController.getById);
childrenRouter.post('/', childrenController.create);
childrenRouter.put('/:id', childrenController.update);
childrenRouter.delete('/:id', childrenController.remove);