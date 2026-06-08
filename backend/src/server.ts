import app from './app';
import prisma from './config/database';
import { runSeed } from './seed';

const PORT = parseInt(process.env.PORT || '5000', 10);

async function startServer() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on 0.0.0.0:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

      // Seed in the background so the API is available immediately.
      // Failures here never take the server down.
      runSeed()
        .then(() => console.log('Background seed finished'))
        .catch((err) => console.error('Background seed failed:', err));
    });
  } catch (error) {
    console.error('Failed to start server:', error);
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
