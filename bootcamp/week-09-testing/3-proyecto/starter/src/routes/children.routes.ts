import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  getAllHandler,
  getByIdHandler,
  createHandler,
  updateHandler,
  deleteHandler,
} from '../controllers/children.controller.js';

export const childrenRouter = Router();

childrenRouter.get('/',        getAllHandler);
childrenRouter.get('/:id',     getByIdHandler);
childrenRouter.post('/',       authenticate, createHandler);
childrenRouter.put('/:id',     authenticate, updateHandler);
childrenRouter.delete('/:id',  authenticate, deleteHandler);
