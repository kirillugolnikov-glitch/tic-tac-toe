import type { GameRepository, GameRecord } from '../ports/GameRepository';
import type { BoardState, GameConfig } from '../domain';

const STORAGE_KEY = 'tic-tac-toe-games';
const STATS_KEY = 'tic-tac-toe-stats';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getStoredGames(): GameRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveGames(games: GameRecord[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
}

function getStoredStats(): { xWins: number; oWins: number; draws: number; totalGames: number } {
  if (typeof window === 'undefined') return { xWins: 0, oWins: 0, draws: 0, totalGames: 0 };
  try {
    const data = localStorage.getItem(STATS_KEY);
    return data ? JSON.parse(data) : { xWins: 0, oWins: 0, draws: 0, totalGames: 0 };
  } catch {
    return { xWins: 0, oWins: 0, draws: 0, totalGames: 0 };
  }
}

function saveStats(stats: { xWins: number; oWins: number; draws: number; totalGames: number }): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export class LocalStorageGameRepository implements GameRepository {
  async save(record: Omit<GameRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<GameRecord> {
    const games = getStoredGames();
    const now = new Date();
    const newRecord: GameRecord = {
      ...record,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    games.unshift(newRecord);
    saveGames(games.slice(0, 100));

    const stats = getStoredStats();
    stats.totalGames += 1;
    if (record.winner === 'X') stats.xWins += 1;
    else if (record.winner === 'O') stats.oWins += 1;
    else if (record.winner === 'draw') stats.draws += 1;
    saveStats(stats);

    return newRecord;
  }

  async findById(id: string): Promise<GameRecord | null> {
    const games = getStoredGames();
    return games.find(g => g.id === id) ?? null;
  }

  async findAll(limit = 50, offset = 0): Promise<GameRecord[]> {
    const games = getStoredGames();
    return games.slice(offset, offset + limit);
  }

  async getStats(): Promise<{ totalGames: number; xWins: number; oWins: number; draws: number }> {
    return getStoredStats();
  }
}

export function createLocalStorageRepository(): GameRepository {
  return new LocalStorageGameRepository();
}