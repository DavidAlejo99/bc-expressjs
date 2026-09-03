import express from 'express';
import parentsRouter from './routes/parents.routes';
import childrenRouter from './routes/children.routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

export const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/v1/parents', parentsRouter);
app.use('/api/v1/children', childrenRouter);

app.use(notFound);
app.use(errorHandler);