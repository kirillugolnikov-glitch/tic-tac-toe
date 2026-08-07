import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { GameConfig, BoardState, Player } from '@tic-tac-toe/shared';

interface GameStore {
  config: GameConfig;
  boardState: BoardState;
  history: BoardState[];
  currentStep: number;
  setConfig: (config: Partial<GameConfig>) => void;
  setBoardState: (state: BoardState) => void;
  setHistory: (history: BoardState[], currentStep: number) => void;
  pushHistory: (state: BoardState) => void;
  setCurrentStep: (step: number) => void;
  reset: () => void;
  resetGameState: () => void;
}

const defaultConfig: GameConfig = {
  size: 3,
  winLength: 3,
  aiDifficulty: 'easy',
  aiPlayer: 'O',
};

const createInitialBoardState = (config: GameConfig): BoardState => ({
  size: config.size,
  cells: Array.from({ length: config.size }, () => Array(config.size).fill(null)),
  currentPlayer: 'X' as Player,
  status: 'in_progress' as const,
  winner: null,
  winningLine: null,
  moveCount: 0,
});

const createInitialStore = (config?: GameConfig) => {
  const cfg = config ?? defaultConfig;
  return {
    config: cfg,
    boardState: createInitialBoardState(cfg),
    history: [],
    currentStep: -1,
  };
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...createInitialStore(),

      setConfig: (partialConfig) =>
        set((state) => ({
          config: { ...state.config, ...partialConfig },
        })),

      setBoardState: (boardState) =>
        set({ boardState }),

      setHistory: (history, currentStep) =>
        set({ history, currentStep }),

      pushHistory: (boardState) =>
        set((state) => {
          const newHistory = state.history.slice(0, state.currentStep + 1);
          newHistory.push(boardState);
          return {
            history: newHistory,
            currentStep: newHistory.length - 1,
            boardState,
          };
        }),

      setCurrentStep: (currentStep) =>
        set((state) => ({
          currentStep,
          boardState: state.history[currentStep] ?? state.boardState,
        })),

      reset: () =>
        set(createInitialStore()),

      resetGameState: () =>
        set((state) => ({
          boardState: createInitialBoardState(state.config),
          history: [],
          currentStep: -1,
        })),
    }),
    {
      name: 'tic-tac-toe-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        config: state.config,
        boardState: state.boardState,
        history: state.history,
        currentStep: state.currentStep,
      }),
    }
  )
);

export const useGameConfig = () => useGameStore((state) => state.config);
export const useBoardState = () => useGameStore((state) => state.boardState);
export const useGameHistory = () => useGameStore((state) => state.history);
export const useCurrentStep = () => useGameStore((state) => state.currentStep);