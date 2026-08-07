import * as React from 'react';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';
import type { BoardState } from '@tic-tac-toe/shared';

interface HistoryProps {
  history: BoardState[];
  currentStep: number;
  onJumpTo: (step: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function History({
  history,
  currentStep,
  onJumpTo,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: HistoryProps) {
  if (history.length <= 1) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          className="flex-1"
        >
          ← Назад
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          className="flex-1"
        >
          Вперёд →
        </Button>
      </div>

      <div className="max-h-60 overflow-y-auto space-y-1 border rounded-lg p-2">
        {history.map((state, index) => (
          <button
            key={index}
            onClick={() => onJumpTo(index)}
            className={cn(
              'w-full text-left px-2 py-1 rounded text-sm transition-colors',
              'hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              index === currentStep && 'bg-primary text-primary-foreground font-medium',
              state.status === 'won' && 'text-green-600 dark:text-green-400',
              state.status === 'draw' && 'text-yellow-600 dark:text-yellow-400'
            )}
          >
            {index === 0 ? (
              'Начало игры'
            ) : (
              <>
                Ход {index}: {' '}
                <span className={cn('font-mono', state.currentPlayer === 'X' && 'text-primary', state.currentPlayer === 'O' && 'text-destructive')}>
                  {state.currentPlayer === 'X' ? 'X' : 'O'}
                </span>
                {state.status === 'won' && (
                  <span className="ml-1 text-xs font-medium text-green-600 dark:text-green-400">
                    (победа {state.winner})
                  </span>
                )}
                {state.status === 'draw' && (
                  <span className="ml-1 text-xs font-medium text-yellow-600 dark:text-yellow-400">
                    (ничья)
                  </span>
                )}
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}