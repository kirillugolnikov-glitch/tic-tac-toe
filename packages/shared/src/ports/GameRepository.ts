import type { BoardState, GameStatus, Player } from '../domain/entities/Board';
import type { GameConfig } from '../domain/GameEngine';

export interface GameRecord {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  config: GameConfig;
  finalState: BoardState;
  winner: Player | 'draw' | null;
  moveCount: number;
}

export interface GameRepository {
  save(record: Omit<GameRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<GameRecord>;
  findById(id: string): Promise<GameRecord | null>;
  findAll(limit?: number, offset?: number): Promise<GameRecord[]>;
  getStats(): Promise<{
    totalGames: number;
    xWins: number;
    oWins: number;
    draws: number;
  }>;
}

export interface AIEngine {
  getMove(board: BoardState, config: GameConfig): Promise<{ row: number; col: number } | null>;
}