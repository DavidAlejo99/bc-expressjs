import { Router } from 'express';
import * as store from '../store.js';
import type { CreateChildDto, UpdateChildDto } from '../types.js';

export const childrenRouter = Router();

childrenRouter.get('/', (_req, res) => {
  res.json(store.getAll());
});

childrenRouter.get('/:id', (req, res) => {
  const child = store.getById(Number(req.params.id));
  if (!child) {
    res.status(404).json({ error: 'Child not found' });
    return;
  }
  res.json(child);
});

childrenRouter.post('/', (req, res) => {
  const dto = req.body as CreateChildDto;
  const newChild = store.create(dto);
  res.status(201).json(newChild);
});

childrenRouter.put('/:id', (req, res) => {
  const dto = req.body as UpdateChildDto;
  const updated = store.update(Number(req.params.id), dto);
  if (!updated) {
    res.status(404).json({ error: 'Child not found' });
    return;
  }
  res.json(updated);
});

childrenRouter.delete('/:id', (req, res) => {
  const success = store.remove(Number(req.params.id));
  if (!success) {
    res.status(404).json({ error: 'Child not found' });
    return;
  }
  res.status(204).send();
});