import { PrismaClient } from '@prisma/client';
import type { GameRepository, GameRecord, GameConfig } from '@tic-tac-toe/shared';
import type { BoardState } from '@tic-tac-toe/shared';

const prisma = new PrismaClient();

function mapGameRecord(record: any): GameRecord {
  return {
    id: record.id,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    config: JSON.parse(record.config) as GameConfig,
    finalState: JSON.parse(record.finalState) as BoardState,
    winner: record.winner as GameRecord['winner'],
    moveCount: record.moveCount,
  };
}

export class PrismaGameRepository implements GameRepository {
  async save(record: Omit<GameRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<GameRecord> {
    const created = await prisma.game.create({
      data: {
        config: JSON.stringify(record.config),
        finalState: JSON.stringify(record.finalState),
        winner: record.winner,
        moveCount: record.moveCount,
      },
    });
    return mapGameRecord(created);
  }

  async findById(id: string): Promise<GameRecord | null> {
    const record = await prisma.game.findUnique({ where: { id } });
    return record ? mapGameRecord(record) : null;
  }

  async findAll(limit = 50, offset = 0): Promise<GameRecord[]> {
    const records = await prisma.game.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });
    return records.map(mapGameRecord);
  }

  async getStats(): Promise<{ totalGames: number; xWins: number; oWins: number; draws: number }> {
    const [totalGames, xWins, oWins, draws] = await Promise.all([
      prisma.game.count(),
      prisma.game.count({ where: { winner: 'X' } }),
      prisma.game.count({ where: { winner: 'O' } }),
      prisma.game.count({ where: { winner: 'draw' } }),
    ]);

    return { totalGames, xWins, oWins, draws };
  }
}

export function createPrismaRepository(): GameRepository {
  return new PrismaGameRepository();
}