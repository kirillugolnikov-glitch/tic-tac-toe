import { FastifyInstance, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function statsRoutes(fastify: FastifyInstance) {
  fastify.get('/stats', async (_request, reply: FastifyReply) => {
    const [totalGames, xWins, oWins, draws] = await Promise.all([
      prisma.game.count(),
      prisma.game.count({ where: { winner: 'X' } }),
      prisma.game.count({ where: { winner: 'O' } }),
      prisma.game.count({ where: { winner: 'draw' } }),
    ]);

    return {
      totalGames,
      xWins,
      oWins,
      draws,
    };
  });
}