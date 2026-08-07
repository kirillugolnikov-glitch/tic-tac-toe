import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  createGameEngine,
  createDefaultGameConfig,
  NInARowWinStrategy,
  RandomAI,
  MediumAI,
  MinimaxAI,
  type GameConfig,
  type BoardState,
  type Position,
} from '@tic-tac-toe/shared';
import { useGameStore, useGameConfig, useBoardState, useGameHistory, useCurrentStep } from '../store/gameStore';

export function useTicTacToe() {
  const config = useGameConfig();
  const boardState = useBoardState();
  const history = useGameHistory();
  const currentStep = useCurrentStep();
  const setConfig = useGameStore((state) => state.setConfig);
  const setBoardState = useGameStore((state) => state.setBoardState);
  const setHistory = useGameStore((state) => state.setHistory);
  const pushHistory = useGameStore((state) => state.pushHistory);
  const setCurrentStep = useGameStore((state) => state.setCurrentStep);
  const reset = useGameStore((state) => state.reset);

  // Refs for latest values to avoid stale closures
  const configRef = useRef(config);
  configRef.current = config;

  const resetCounter = useRef(0);
  const isProcessingRef = useRef(false);

  const engine = useMemo(() => {
    const winStrategy = new NInARowWinStrategy(config.size, config.winLength);
    let aiStrategy;
    switch (config.aiDifficulty) {
      case 'easy':
        aiStrategy = new RandomAI();
        break;
      case 'medium':
        aiStrategy = new MediumAI(0.7);
        break;
      case 'hard':
        aiStrategy = new MinimaxAI();
        break;
      default:
        aiStrategy = new RandomAI();
    }
    return createGameEngine(config, winStrategy, aiStrategy);
  }, [config.size, config.winLength, config.aiDifficulty, config.aiPlayer, resetCounter.current]);

  // Initialize on mount
  useEffect(() => {
    if (history.length === 0) {
      const initialState = engine.getState();
      setHistory([initialState], 0);
      setBoardState(initialState);
    }
  }, []);

  // Handle config changes - reset game state and sync with new engine
  useEffect(() => {
    useGameStore.getState().resetGameState();
    const initialState = engine.getState();
    setHistory([initialState], 0);
    setBoardState(initialState);
  }, [engine, config.size, config.winLength]);

  // Trigger AI move after human move
  useEffect(() => {
    // Check if it's AI's turn and we're not already processing
    if (
      boardState.status === 'in_progress' &&
      boardState.currentPlayer === config.aiPlayer &&
      !isProcessingRef.current &&
      history.length > 0 // Ensure game has started
    ) {
      isProcessingRef.current = true;
      
      setTimeout(() => {
        const aiState = engine.makeAIMove();
        pushHistory(aiState);
        setBoardState(aiState);
        isProcessingRef.current = false;
      }, 300);
    }
  }, [boardState, config.aiPlayer]);

  const makeMove = useCallback(
    (row: number, col: number) => {
      // Prevent moves during AI processing
      if (isProcessingRef.current) return;
      
      const newState = engine.makeMove(row, col);
      pushHistory(newState);
      setBoardState(newState);
    },
    [engine, pushHistory, setBoardState]
  );

  const undo = useCallback(() => {
    const state = engine.undo();
    if (state) {
      setCurrentStep(engine.getCurrentStep());
      setBoardState(state);
    }
    return state;
  }, [engine, setCurrentStep, setBoardState]);

  const redo = useCallback(() => {
    const state = engine.redo();
    if (state) {
      setCurrentStep(engine.getCurrentStep());
      setBoardState(state);
    }
    return state;
  }, [engine, setCurrentStep, setBoardState]);

  const jumpToStep = useCallback(
    (step: number) => {
      const state = engine.jumpToStep(step);
      setCurrentStep(step);
      setBoardState(state);
    },
    [engine, setCurrentStep, setBoardState]
  );

  const resetGame = useCallback(
    (newConfig?: GameConfig | Partial<GameConfig>) => {
      const currentConfig = configRef.current;
      const finalConfig = newConfig ?? currentConfig;
      
      if (newConfig) {
        setConfig(finalConfig);
      }
      
      resetCounter.current += 1;
      useGameStore.getState().resetGameState();
    },
    [setConfig]
  );

  const canUndo = engine.canUndo();
  const canRedo = engine.canRedo();

  return {
    boardState,
    config,
    history,
    currentStep,
    makeMove,
    undo,
    redo,
    jumpToStep,
    resetGame,
    canUndo,
    canRedo,
    setConfig,
  };
}