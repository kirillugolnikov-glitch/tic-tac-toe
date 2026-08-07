import type {
  BoardState,
  Player,
  Position,
  GameStatus,
  WinResult,
} from './entities/Board';
import type { WinStrategy } from './strategies/WinStrategy';
import type { AIMoveStrategy } from './ai/RandomAI';
import { createInitialBoardState, applyMove, switchPlayer } from './entities/Board';

export interface GameEngine {
  getState(): BoardState;
  makeMove(row: number, col: number): BoardState;
  makeAIMove(): BoardState;
  undo(): BoardState | null;
  redo(): BoardState | null;
  canUndo(): boolean;
  canRedo(): boolean;
  reset(size?: number, winLength?: number): BoardState;
  getHistory(): BoardState[];
  getCurrentStep(): number;
  jumpToStep(step: number): BoardState;
}

export interface GameConfig {
  size: number;
  winLength: number;
  aiDifficulty: 'easy' | 'medium' | 'hard';
  aiPlayer: Player;
}

export function createGameEngine(
  config: GameConfig,
  winStrategy: WinStrategy,
  aiStrategy: AIMoveStrategy
): GameEngine {
  let history: BoardState[] = [];
  let currentStep = -1;
  let currentConfig = { ...config };

  function initBoard(size: number, winLength: number): BoardState {
    const state = createInitialBoardState(size);
    history = [state];
    currentStep = 0;
    return state;
  }

  function pushState(state: BoardState): BoardState {
    history = history.slice(0, currentStep + 1);
    history.push(state);
    currentStep = history.length - 1;
    return state;
  }

  function checkGameEnd(state: BoardState): BoardState {
    const winResult = winStrategy.checkWin(state);
    if (winResult) {
      return {
        ...state,
        status: 'won',
        winner: winResult.winner,
        winningLine: winResult.line,
      };
    }

    if (winStrategy.checkDraw(state)) {
      return { ...state, status: 'draw' };
    }

    return state;
  }

  let state = initBoard(config.size, config.winLength);

  return {
    getState(): BoardState {
      return state;
    },

    makeMove(row: number, col: number): BoardState {
      if (state.status !== 'in_progress') return state;

      const newState = applyMove(state, row, col);
      const checkedState = checkGameEnd(newState);
      state = pushState(checkedState);
      return state;
    },

    makeAIMove(): BoardState {
      if (state.status !== 'in_progress') return state;
      if (state.currentPlayer !== config.aiPlayer) return state;

      const move = aiStrategy.getMove(state, winStrategy);
      if (!move) return state;

      return this.makeMove(move.row, move.col);
    },

    undo(): BoardState | null {
      if (currentStep <= 0) return null;
      currentStep--;
      state = history[currentStep];
      return state;
    },

    redo(): BoardState | null {
      if (currentStep >= history.length - 1) return null;
      currentStep++;
      state = history[currentStep];
      return state;
    },

    canUndo(): boolean {
      return currentStep > 0;
    },

    canRedo(): boolean {
      return currentStep < history.length - 1;
    },

    reset(size?: number, winLength?: number): BoardState {
      currentConfig = { ...currentConfig, size: size ?? currentConfig.size, winLength: winLength ?? currentConfig.winLength };
      state = initBoard(currentConfig.size, currentConfig.winLength);
      return state;
    },

    getHistory(): BoardState[] {
      return [...history];
    },

    getCurrentStep(): number {
      return currentStep;
    },

    jumpToStep(step: number): BoardState {
      if (step < 0 || step >= history.length) return state;
      currentStep = step;
      state = history[step];
      return state;
    },
  };
}

export function createDefaultGameConfig(): GameConfig {
  return {
    size: 3,
    winLength: 3,
    aiDifficulty: 'easy',
    aiPlayer: 'O',
  };
}