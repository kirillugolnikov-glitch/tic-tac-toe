import { describe, it, expect } from 'vitest';
import {
  createEmptyBoard,
  createInitialBoardState,
  cloneBoard,
  cloneBoardState,
  isValidMove,
  applyMove,
  switchPlayer,
  getCell,
} from './domain/entities/Board';
import { ClassicWinStrategy, NInARowWinStrategy } from './domain/strategies/WinStrategy';
import { RandomAI } from './domain/ai/RandomAI';
import { createGameEngine, createDefaultGameConfig } from './domain/GameEngine';

describe('Board entities', () => {
  it('creates empty board of given size', () => {
    const board = createEmptyBoard(3);
    expect(board).toHaveLength(3);
    expect(board[0]).toHaveLength(3);
    expect(board[0][0]).toBeNull();
  });

  it('creates initial board state', () => {
    const state = createInitialBoardState(3);
    expect(state.size).toBe(3);
    expect(state.currentPlayer).toBe('X');
    expect(state.status).toBe('in_progress');
    expect(state.moveCount).toBe(0);
  });

  it('clones board correctly', () => {
    const board = createEmptyBoard(3);
    board[0][0] = 'X';
    const cloned = cloneBoard(board);
    expect(cloned[0][0]).toBe('X');
    cloned[0][0] = 'O';
    expect(board[0][0]).toBe('X');
  });

  it('clones board state correctly', () => {
    const state = createInitialBoardState(3);
    state.cells[0][0] = 'X';
    const cloned = cloneBoardState(state);
    expect(cloned.cells[0][0]).toBe('X');
    cloned.cells[0][0] = 'O';
    expect(state.cells[0][0]).toBe('X');
  });

  it('validates moves correctly', () => {
    const state = createInitialBoardState(3);
    expect(isValidMove(state, 0, 0)).toBe(true);
    expect(isValidMove(state, 3, 0)).toBe(false);
    expect(isValidMove(state, -1, 0)).toBe(false);

    state.cells[0][0] = 'X';
    expect(isValidMove(state, 0, 0)).toBe(false);

    state.status = 'won';
    expect(isValidMove(state, 1, 1)).toBe(false);
  });

  it('applies moves correctly', () => {
    let state = createInitialBoardState(3);
    state = applyMove(state, 0, 0);
    expect(state.cells[0][0]).toBe('X');
    expect(state.currentPlayer).toBe('O');
    expect(state.moveCount).toBe(1);
  });

  it('switches player correctly', () => {
    expect(switchPlayer('X')).toBe('O');
    expect(switchPlayer('O')).toBe('X');
  });

  it('gets cell value', () => {
    const state = createInitialBoardState(3);
    state.cells[1][2] = 'O';
    expect(getCell(state, 1, 2)).toBe('O');
    expect(getCell(state, 5, 5)).toBeNull();
  });
});

describe('WinStrategy', () => {
  it('detects horizontal win', () => {
    const strategy = new ClassicWinStrategy(3);
    const state = createInitialBoardState(3);
    state.cells[0][0] = 'X';
    state.cells[0][1] = 'X';
    state.cells[0][2] = 'X';
    state.status = 'in_progress';
    state.moveCount = 3;

    const result = strategy.checkWin(state);
    expect(result).not.toBeNull();
    expect(result?.winner).toBe('X');
    expect(result?.line).toHaveLength(3);
  });

  it('detects vertical win', () => {
    const strategy = new ClassicWinStrategy(3);
    const state = createInitialBoardState(3);
    state.cells[0][1] = 'O';
    state.cells[1][1] = 'O';
    state.cells[2][1] = 'O';
    state.status = 'in_progress';
    state.moveCount = 3;

    const result = strategy.checkWin(state);
    expect(result).not.toBeNull();
    expect(result?.winner).toBe('O');
  });

  it('detects diagonal win', () => {
    const strategy = new ClassicWinStrategy(3);
    const state = createInitialBoardState(3);
    state.cells[0][0] = 'X';
    state.cells[1][1] = 'X';
    state.cells[2][2] = 'X';
    state.status = 'in_progress';
    state.moveCount = 3;

    const result = strategy.checkWin(state);
    expect(result).not.toBeNull();
    expect(result?.winner).toBe('X');
  });

  it('detects anti-diagonal win', () => {
    const strategy = new ClassicWinStrategy(3);
    const state = createInitialBoardState(3);
    state.cells[0][2] = 'O';
    state.cells[1][1] = 'O';
    state.cells[2][0] = 'O';
    state.status = 'in_progress';
    state.moveCount = 3;

    const result = strategy.checkWin(state);
    expect(result).not.toBeNull();
    expect(result?.winner).toBe('O');
  });

  it('detects draw', () => {
    const strategy = new ClassicWinStrategy(3);
    const state = createInitialBoardState(3);
    state.cells = [
      ['X', 'O', 'X'],
      ['X', 'O', 'O'],
      ['O', 'X', 'X'],
    ];
    state.status = 'in_progress';
    state.moveCount = 9;

    expect(strategy.checkDraw(state)).toBe(true);
  });

  it('works with N-in-a-row on larger board', () => {
    const strategy = new NInARowWinStrategy(5, 4);
    const state = createInitialBoardState(5);
    state.cells[2][0] = 'X';
    state.cells[2][1] = 'X';
    state.cells[2][2] = 'X';
    state.cells[2][3] = 'X';
    state.status = 'in_progress';
    state.moveCount = 4;

    const result = strategy.checkWin(state);
    expect(result).not.toBeNull();
    expect(result?.winner).toBe('X');
  });
});

describe('RandomAI', () => {
  it('returns valid move on empty board', () => {
    const ai = new RandomAI();
    const strategy = new ClassicWinStrategy(3);
    const state = createInitialBoardState(3);

    const move = ai.getMove(state, strategy);
    expect(move).not.toBeNull();
    expect(move?.row).toBeGreaterThanOrEqual(0);
    expect(move?.row).toBeLessThan(3);
    expect(move?.col).toBeGreaterThanOrEqual(0);
    expect(move?.col).toBeLessThan(3);
  });

  it('returns null on full board', () => {
    const ai = new RandomAI();
    const strategy = new ClassicWinStrategy(3);
    const state = createInitialBoardState(3);
    state.cells = [
      ['X', 'O', 'X'],
      ['X', 'O', 'O'],
      ['O', 'X', 'X'],
    ];
    state.moveCount = 9;

    const move = ai.getMove(state, strategy);
    expect(move).toBeNull();
  });

  it('has correct metadata', () => {
    const ai = new RandomAI();
    expect(ai.getName()).toBe('Random AI');
    expect(ai.getDifficulty()).toBe('easy');
  });
});

describe('GameEngine', () => {
  it('creates engine with default config', () => {
    const config = createDefaultGameConfig();
    const strategy = new ClassicWinStrategy(config.size);
    const ai = new RandomAI();
    const engine = createGameEngine(config, strategy, ai);

    const state = engine.getState();
    expect(state.size).toBe(3);
    expect(state.currentPlayer).toBe('X');
    expect(state.status).toBe('in_progress');
  });

  it('makes human move and switches player', () => {
    const config = createDefaultGameConfig();
    const strategy = new ClassicWinStrategy(config.size);
    const ai = new RandomAI();
    const engine = createGameEngine(config, strategy, ai);

    let state = engine.makeMove(0, 0);
    expect(state.cells[0][0]).toBe('X');
    expect(state.currentPlayer).toBe('O');
    expect(state.moveCount).toBe(1);
  });

  it('prevents invalid moves', () => {
    const config = createDefaultGameConfig();
    const strategy = new ClassicWinStrategy(config.size);
    const ai = new RandomAI();
    const engine = createGameEngine(config, strategy, ai);

    engine.makeMove(0, 0);
    const state = engine.makeMove(0, 0);
    expect(state.cells[0][0]).toBe('X');
    expect(state.moveCount).toBe(1);
  });

  it('detects win', () => {
    const config = createDefaultGameConfig();
    const strategy = new ClassicWinStrategy(config.size);
    const ai = new RandomAI();
    const engine = createGameEngine(config, strategy, ai);

    engine.makeMove(0, 0); // X
    engine.makeMove(1, 0); // O
    engine.makeMove(0, 1); // X
    engine.makeMove(1, 1); // O
    const state = engine.makeMove(0, 2); // X wins

    expect(state.status).toBe('won');
    expect(state.winner).toBe('X');
    expect(state.winningLine).toHaveLength(3);
  });

  it('supports undo/redo', () => {
    const config = createDefaultGameConfig();
    const strategy = new ClassicWinStrategy(config.size);
    const ai = new RandomAI();
    const engine = createGameEngine(config, strategy, ai);

    engine.makeMove(0, 0);
    engine.makeMove(1, 1);
    expect(engine.canUndo()).toBe(true);

    const afterUndo = engine.undo();
    expect(afterUndo?.moveCount).toBe(1);
    expect(engine.canRedo()).toBe(true);

    const afterRedo = engine.redo();
    expect(afterRedo?.moveCount).toBe(2);
  });

  it('supports jump to step', () => {
    const config = createDefaultGameConfig();
    const strategy = new ClassicWinStrategy(config.size);
    const ai = new RandomAI();
    const engine = createGameEngine(config, strategy, ai);

    engine.makeMove(0, 0);
    engine.makeMove(1, 1);
    engine.makeMove(0, 1);

    const history = engine.getHistory();
    expect(history).toHaveLength(4);

    const state = engine.jumpToStep(1);
    expect(state.moveCount).toBe(1);
    expect(engine.getCurrentStep()).toBe(1);
  });

  it('resets with new size', () => {
    const config = createDefaultGameConfig();
    const strategy = new ClassicWinStrategy(config.size);
    const ai = new RandomAI();
    const engine = createGameEngine(config, strategy, ai);

    engine.makeMove(0, 0);
    const state = engine.reset(5, 4);
    expect(state.size).toBe(5);
    expect(state.moveCount).toBe(0);
  });
});