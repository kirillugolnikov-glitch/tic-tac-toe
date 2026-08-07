import type { BoardState, Position, WinResult, Player } from '../entities/Board';

export interface WinStrategy {
  checkWin(board: BoardState): WinResult | null;
  checkDraw(board: BoardState): boolean;
  getName(): string;
}

export function createWinStrategy(size: number, winLength: number): WinStrategy {
  return new NInARowWinStrategy(size, winLength);
}

export class NInARowWinStrategy implements WinStrategy {
  constructor(
    private readonly boardSize: number,
    private readonly winLength: number
  ) {}

  getName(): string {
    return `N-in-a-row (${this.winLength})`;
  }

  checkWin(board: BoardState): WinResult | null {
    const { cells, size } = board;
    const directions = [
      { dr: 0, dc: 1 },   // horizontal
      { dr: 1, dc: 0 },   // vertical
      { dr: 1, dc: 1 },   // diagonal \
      { dr: 1, dc: -1 },  // diagonal /
    ];

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const player = cells[row][col];
        if (player === null) continue;

        for (const { dr, dc } of directions) {
          const line = this.checkDirection(cells, row, col, dr, dc, player);
          if (line.length >= this.winLength) {
            return { winner: player, line: line.slice(0, this.winLength) };
          }
        }
      }
    }
    return null;
  }

  private checkDirection(
    cells: BoardState['cells'],
    startRow: number,
    startCol: number,
    dr: number,
    dc: number,
    player: Player
  ): Position[] {
    const line: Position[] = [];
    let row = startRow;
    let col = startCol;

    while (
      row >= 0 &&
      row < this.boardSize &&
      col >= 0 &&
      col < this.boardSize &&
      cells[row][col] === player
    ) {
      line.push({ row, col });
      row += dr;
      col += dc;
    }

    return line;
  }

  checkDraw(board: BoardState): boolean {
    return board.status === 'in_progress' && board.moveCount === board.size * board.size;
  }
}

export class ClassicWinStrategy implements WinStrategy {
  private strategy: NInARowWinStrategy;

  constructor(size: number = 3) {
    this.strategy = new NInARowWinStrategy(size, 3);
  }

  getName(): string {
    return 'Classic 3-in-a-row';
  }

  checkWin(board: BoardState): WinResult | null {
    return this.strategy.checkWin(board);
  }

  checkDraw(board: BoardState): boolean {
    return this.strategy.checkDraw(board);
  }
}