import type { BoardState, Position, Player, WinResult } from '../entities/Board';
import type { WinStrategy } from '../strategies/WinStrategy';
import type { AIMoveStrategy } from './RandomAI';

export class MinimaxAI implements AIMoveStrategy {
  getName(): string {
    return 'Minimax AI';
  }

  getDifficulty(): 'easy' | 'medium' | 'hard' {
    return 'hard';
  }

  // Max depth - reduced for 4x4+ boards
  private maxDepth = 5;
  // Time budget in milliseconds
  private timeBudget = 800;

  getMove(board: BoardState, winStrategy: WinStrategy): Position | null {
    const aiPlayer = board.currentPlayer;
    const emptyCells = this.getEmptyCells(board);
    if (emptyCells.length === 0) return null;

    // Adaptive depth: shallower for more empty cells (larger boards)
    const adaptiveDepth = Math.min(this.maxDepth, Math.max(2, Math.floor(20 / (emptyCells.length / 4 + 1))));

    const startTime = Date.now();
    let bestScore = -Infinity;
    let bestMove: Position | null = emptyCells[0]; // fallback

    for (const cell of emptyCells) {
      // Time check
      if (Date.now() - startTime > this.timeBudget) break;
      
      const boardCopy = this.cloneBoard(board);
      boardCopy.cells[cell.row][cell.col] = aiPlayer;
      boardCopy.currentPlayer = aiPlayer === 'X' ? 'O' : 'X';
      
      const score = this.minimax(boardCopy, winStrategy, 0, adaptiveDepth, false, aiPlayer, startTime);

      if (score > bestScore) {
        bestScore = score;
        bestMove = cell;
      }
    }

    return bestMove;
  }

  private minimax(
    board: BoardState,
    winStrategy: WinStrategy,
    depth: number,
    maxDepth: number,
    isMaximizing: boolean,
    aiPlayer: Player,
    startTime: number
  ): number {
    // Time budget check
    if (Date.now() - startTime > this.timeBudget) {
      return this.evaluateBoard(board, winStrategy, aiPlayer);
    }

    const humanPlayer = aiPlayer === 'X' ? 'O' : 'X';
    
    const winResult = winStrategy.checkWin(board);
    if (winResult) {
      return winResult.winner === aiPlayer ? 10 - depth : depth - 10;
    }
    
    if (winStrategy.checkDraw(board)) {
      return 0;
    }

    // Depth limit reached
    if (depth >= maxDepth) {
      return this.evaluateBoard(board, winStrategy, aiPlayer);
    }

    const emptyCells = this.getEmptyCells(board);
    
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (const cell of emptyCells) {
        // Time check in loop
        if (Date.now() - startTime > this.timeBudget) break;
        
        const nextBoard = this.cloneBoard(board);
        nextBoard.cells[cell.row][cell.col] = aiPlayer;
        nextBoard.currentPlayer = humanPlayer;
        
        const score = this.minimax(nextBoard, winStrategy, depth + 1, maxDepth, false, aiPlayer, startTime);
        bestScore = Math.max(score, bestScore);
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (const cell of emptyCells) {
        if (Date.now() - startTime > this.timeBudget) break;
        
        const nextBoard = this.cloneBoard(board);
        nextBoard.cells[cell.row][cell.col] = humanPlayer;
        nextBoard.currentPlayer = aiPlayer;
        
        const score = this.minimax(nextBoard, winStrategy, depth + 1, maxDepth, true, aiPlayer, startTime);
        bestScore = Math.min(score, bestScore);
      }
      return bestScore;
    }
  }

  // Heuristic evaluation for non-terminal states at max depth
  private evaluateBoard(board: BoardState, winStrategy: WinStrategy, aiPlayer: Player): number {
    const humanPlayer = aiPlayer === 'X' ? 'O' : 'X';
    let score = 0;
    
    // Count potential winning lines for AI
    score += this.countThreats(board, aiPlayer, winStrategy) * 5;
    // Penalize human threats
    score -= this.countThreats(board, humanPlayer, winStrategy) * 4;
    
    return score;
  }

  private countThreats(board: BoardState, player: Player, winStrategy: WinStrategy): number {
    let threats = 0;
    const size = board.size;
    const winLength = (winStrategy as any).winLength || 3;
    
    // Check rows
    for (let row = 0; row < size; row++) {
      for (let col = 0; col <= size - winLength; col++) {
        let count = 0;
        let empty = 0;
        for (let i = 0; i < winLength; i++) {
          if (board.cells[row][col + i] === player) count++;
          else if (board.cells[row][col + i] === null) empty++;
        }
        if (count > 0 && count + empty >= winLength) threats += count;
      }
    }
    
    // Check columns
    for (let col = 0; col < size; col++) {
      for (let row = 0; row <= size - winLength; row++) {
        let count = 0;
        let empty = 0;
        for (let i = 0; i < winLength; i++) {
          if (board.cells[row + i][col] === player) count++;
          else if (board.cells[row + i][col] === null) empty++;
        }
        if (count > 0 && count + empty >= winLength) threats += count;
      }
    }
    
    // Check diagonals (top-left to bottom-right)
    for (let row = 0; row <= size - winLength; row++) {
      for (let col = 0; col <= size - winLength; col++) {
        let count = 0;
        let empty = 0;
        for (let i = 0; i < winLength; i++) {
          if (board.cells[row + i][col + i] === player) count++;
          else if (board.cells[row + i][col + i] === null) empty++;
        }
        if (count > 0 && count + empty >= winLength) threats += count;
      }
    }
    
    // Check diagonals (top-right to bottom-left)
    for (let row = 0; row <= size - winLength; row++) {
      for (let col = winLength - 1; col < size; col++) {
        let count = 0;
        let empty = 0;
        for (let i = 0; i < winLength; i++) {
          if (board.cells[row + i][col - i] === player) count++;
          else if (board.cells[row + i][col - i] === null) empty++;
        }
        if (count > 0 && count + empty >= winLength) threats += count;
      }
    }
    
    return threats;
  }

  private getEmptyCells(board: BoardState): Position[] {
    const cells: Position[] = [];
    for (let row = 0; row < board.size; row++) {
      for (let col = 0; col < board.size; col++) {
        if (board.cells[row][col] === null) {
          cells.push({ row, col });
        }
      }
    }
    return cells;
  }

  private cloneBoard(board: BoardState): BoardState {
    return {
      ...board,
      cells: board.cells.map(row => [...row]),
    };
  }
}