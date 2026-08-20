import { app } from './app';
import { logger } from './config/logger';
import { prisma } from './lib/prisma';

const PORT = process.env['PORT'] ?? 3000;

const server = app.listen(Number(PORT), () => {
  logger.info(`Servidor escuchando en el puerto ${PORT}`);
});

function shutdown(signal: string): void {
  logger.info(`Señal ${signal} recibida, cerrando servidor...`);
  server.close(async () => {
    await prisma.$disconnect();
    logger.info('Conexiones cerradas. Adiós.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));