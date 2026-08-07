import type { BoardState, Position } from '../entities/Board';
import type { WinStrategy } from '../strategies/WinStrategy';

export interface AIMoveStrategy {
  getMove(board: BoardState, winStrategy: WinStrategy): Position | null;
  getName(): string;
  getDifficulty(): 'easy' | 'medium' | 'hard';
}

export class RandomAI implements AIMoveStrategy {
  getName(): string {
    return 'Random AI';
  }

  getDifficulty(): 'easy' | 'medium' | 'hard' {
    return 'easy';
  }

  getMove(board: BoardState, _winStrategy: WinStrategy): Position | null {
    const emptyCells: Position[] = [];

    for (let row = 0; row < board.size; row++) {
      for (let col = 0; col < board.size; col++) {
        if (board.cells[row][col] === null) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
  }
}

export function createAI(difficulty: 'easy' | 'medium' | 'hard' = 'easy'): AIMoveStrategy {
  switch (difficulty) {
    case 'easy':
      return new RandomAI();
    case 'medium':
      return new RandomAI();
    case 'hard':
      return new RandomAI();
    default:
      return new RandomAI();
  }
}