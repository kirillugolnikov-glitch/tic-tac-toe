import type { BoardState, Position } from '../entities/Board';
import type { WinStrategy } from '../strategies/WinStrategy';
import type { AIMoveStrategy } from './RandomAI';
import { RandomAI } from './RandomAI';
import { MinimaxAI } from './MinimaxAI';

export class MediumAI implements AIMoveStrategy {
  private randomAI: RandomAI;
  private minimaxAI: MinimaxAI;
  private useMinimaxProbability = 0.7;

  constructor(useMinimaxProbability = 0.7) {
    this.randomAI = new RandomAI();
    this.minimaxAI = new MinimaxAI();
    this.useMinimaxProbability = useMinimaxProbability;
  }

  getName(): string {
    return 'Medium AI';
  }

  getDifficulty(): 'easy' | 'medium' | 'hard' {
    return 'medium';
  }

  getMove(board: BoardState, winStrategy: WinStrategy): Position | null {
    // 70% chance to use minimax, 30% random
    if (Math.random() < this.useMinimaxProbability) {
      return this.minimaxAI.getMove(board, winStrategy);
    }
    return this.randomAI.getMove(board, winStrategy);
  }
}