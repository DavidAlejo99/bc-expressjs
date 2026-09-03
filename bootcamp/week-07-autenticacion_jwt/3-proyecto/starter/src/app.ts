import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes';
import childrenRouter from './routes/children.routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

export const app: Express = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/children', childrenRouter);

app.use(notFound);
app.use(errorHandler);
