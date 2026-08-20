import express from 'express';
import { childrenRouter } from './routes/children.routes';
import { parentsRouter } from './routes/parents.routes';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';

export const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/v1/children', childrenRouter);
app.use('/api/v1/parents', parentsRouter);

app.use(notFound);
app.use(errorHandler);