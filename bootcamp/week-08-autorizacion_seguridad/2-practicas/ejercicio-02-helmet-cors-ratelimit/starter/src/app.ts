import 'dotenv/config';
import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import { sanitizeInputs } from './middlewares/sanitizeInputs.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import { globalLimiter, corsOptions } from './config/security.js';

export const app: Express = express();

// Helmet — 12 headers de seguridad HTTP por defecto. Siempre antes de las rutas.
app.use(helmet());

// Rate limiter global
app.use(globalLimiter);

// CORS con whitelist (nunca cors() a secas)
app.options('/*splat', cors(corsOptions)); // preflight
app.use(cors(corsOptions));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Sanitización NoSQL — después de parsear, antes de las rutas
app.use(sanitizeInputs);

// Health check — ruta pública sin auth
app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);

// Error handling (always last)
app.use(notFound);
app.use(errorHandler);
