import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import {
  CreateGameRequestSchema,
  MakeMoveRequestSchema,
  GameResponseSchema,
} from '@tic-tac-toe/shared';
import {
  createGameEngine,
  createDefaultGameConfig,
  NInARowWinStrategy,
  RandomAI,
  MediumAI,
  MinimaxAI,
  type GameConfig,
  type BoardState,
} from '@tic-tac-toe/shared';

const prisma = new PrismaClient();

function getAIForDifficulty(difficulty: GameConfig['aiDifficulty']) {
  switch (difficulty) {
    case 'easy':
      return new RandomAI();
    case 'medium':
      return new MediumAI(0.5);
    case 'hard':
      return new MinimaxAI();
    default:
      return new RandomAI();
  }
}

export async function gamesRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: z.infer<typeof CreateGameRequestSchema> }>(
    '/games',
    async (request: FastifyRequest<{ Body: z.infer<typeof CreateGameRequestSchema> }>, reply: FastifyReply) => {
      const config = request.body.config ?? createDefaultGameConfig();
      const winStrategy = new NInARowWinStrategy(config.size, config.winLength);
      const aiStrategy = getAIForDifficulty(config.aiDifficulty);
      const engine = createGameEngine(config, winStrategy, aiStrategy);

      const initialState = engine.getState();
      const gameId = crypto.randomUUID();

      gamesMap.set(gameId, engine);

      const saved = await prisma.game.create({
        data: {
          id: gameId,
          config,
          finalState: initialState,
          winner: null,
          moveCount: 0,
        },
      });

      return reply.code(201).send({
        game: {
          id: saved.id,
          createdAt: saved.createdAt,
          updatedAt: saved.updatedAt,
          config: saved.config as GameConfig,
          finalState: saved.finalState as BoardState,
          winner: saved.winner as BoardState['winner'],
          moveCount: saved.moveCount,
        },
      });
    }
  );

  fastify.get<{ Params: { id: string } }>(
    '/games/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const game = await prisma.game.findUnique({ where: { id: request.params.id } });
      if (!game) {
        return reply.code(404).send({ error: 'Game not found' });
      }
      return {
        game: {
          id: game.id,
          createdAt: game.createdAt,
          updatedAt: game.updatedAt,
          config: game.config as GameConfig,
          finalState: game.finalState as BoardState,
          winner: game.winner as BoardState['winner'],
          moveCount: game.moveCount,
        },
      };
    }
  );

  fastify.post<{ Body: z.infer<typeof MakeMoveRequestSchema> }>(
    '/games/:id/move',
    async (request: FastifyRequest<{ Params: { id: string }; Body: z.infer<typeof MakeMoveRequestSchema> }>, reply: FastifyReply) => {
      const { id } = request.params;
      const { row, col } = request.body;

      const game = await prisma.game.findUnique({ where: { id } });
      if (!game) {
        return reply.code(404).send({ error: 'Game not found' });
      }

      let engine = gamesMap.get(id);
      if (!engine) {
        const config = game.config as GameConfig;
        const winStrategy = new NInARowWinStrategy(config.size, config.winLength);
        const aiStrategy = getAIForDifficulty(config.aiDifficulty);
        engine = createGameEngine(config, winStrategy, aiStrategy);
        gamesMap.set(id, engine);
      }

      const currentState = engine.getState();
      if (currentState.status !== 'in_progress') {
        return reply.code(400).send({ error: 'Game already finished' });
      }

      const newState = engine.makeMove(row, col);

      if (newState.status === 'in_progress' && newState.currentPlayer === (game.config as GameConfig).aiPlayer) {
        const aiState = engine.makeAIMove();
        await prisma.game.update({
          where: { id },
          data: {
            finalState: aiState,
            winner: aiState.winner,
            moveCount: aiState.moveCount,
          },
        });
        return {
          game: {
            id: game.id,
            createdAt: game.createdAt,
            updatedAt: new Date(),
            config: game.config as GameConfig,
            finalState: aiState,
            winner: aiState.winner,
            moveCount: aiState.moveCount,
          },
        };
      }

      await prisma.game.update({
        where: { id },
        data: {
          finalState: newState,
          winner: newState.winner,
          moveCount: newState.moveCount,
        },
      });

      return {
        game: {
          id: game.id,
          createdAt: game.createdAt,
          updatedAt: new Date(),
          config: game.config as GameConfig,
          finalState: newState,
          winner: newState.winner,
          moveCount: newState.moveCount,
        },
      };
    }
  );

  fastify.get('/games', async (request: FastifyRequest<{ Querystring: { limit?: string; offset?: string } }>, reply: FastifyReply) => {
    const limit = parseInt(request.query.limit ?? '50');
    const offset = parseInt(request.query.offset ?? '0');

    const games = await prisma.game.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });

    return {
      games: games.map((g) => ({
        id: g.id,
        createdAt: g.createdAt,
        updatedAt: g.updatedAt,
        config: g.config as GameConfig,
        finalState: g.finalState as BoardState,
        winner: g.winner as BoardState['winner'],
        moveCount: g.moveCount,
      })),
    };
  });
}