import app from './app';
import prisma from './config/database';
import { runSeed } from './seed';

const PORT = parseInt(process.env.PORT || '5000', 10);

// Log to stderr (unbuffered) so startup/crash output is always visible in logs.
const log = (msg: string) => process.stderr.write(`${msg}\n`);

process.on('uncaughtException', (err) => {
  log(`UNCAUGHT EXCEPTION: ${err?.stack || err}`);
  process.exit(1);
});
process.on('unhandledRejection', (err) => {
  log(`UNHANDLED REJECTION: ${(err as Error)?.stack || err}`);
});

async function startServer() {
  try {
    log(`Booting server… PORT=${process.env.PORT || '(unset, default 5000)'}`);
    await prisma.$connect();
    log('Database connected successfully');

    app.listen(PORT, '0.0.0.0', () => {
      log(`Server running on 0.0.0.0:${PORT}`);
      log(`Environment: ${process.env.NODE_ENV || 'development'}`);

      // Seed in the background so the API is available immediately.
      // Failures here never take the server down.
      runSeed()
        .then(() => log('Background seed finished'))
        .catch((err) => log(`Background seed failed: ${err?.stack || err}`));
    });
  } catch (error) {
    log(`Failed to start server: ${(error as Error)?.stack || error}`);
    await prisma.$disconnect();
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
