import fastify from 'fastify';
import cors from '@fastify/cors';
import { gamesRoutes } from './routes/games';
import { statsRoutes } from './routes/stats';

const server = fastify({ logger: true });

async function main() {
  await server.register(cors, {
    origin: true,
    credentials: true,
  });

  await server.register(gamesRoutes, { prefix: '/api' });
  await server.register(statsRoutes, { prefix: '/api' });

  server.get('/health', async () => ({ status: 'ok' }));

  const port = parseInt(process.env.PORT ?? '4000');
  const host = process.env.HOST ?? '0.0.0.0';

  try {
    await server.listen({ port, host });
    console.log(`Server running at http://${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

main();