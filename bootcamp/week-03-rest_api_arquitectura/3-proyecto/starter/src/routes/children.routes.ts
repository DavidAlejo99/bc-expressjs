import { Router } from 'express';
import * as controller from '../controllers/children.controller';

export const childrenRouter = Router();

childrenRouter.get('/', controller.getAll);
childrenRouter.get('/:id', controller.getById);
childrenRouter.post('/', controller.create);
childrenRouter.put('/:id', controller.update);
childrenRouter.delete('/:id', controller.remove);