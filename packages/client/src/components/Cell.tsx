import * as React from 'react';
import { cn } from '../lib/utils';
import type { Position, CellValue } from '@tic-tac-toe/shared';

interface CellProps {
  value: CellValue;
  position: Position;
  onClick: () => void;
  isWinning?: boolean;
  disabled?: boolean;
}

export function Cell({ value, position, onClick, isWinning, disabled }: CellProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || value !== null}
      className={cn(
        'relative aspect-square flex items-center justify-center text-3xl font-bold transition-all',
        'border border-border',
        'hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=winning]:bg-green-100 dark:data-[state=winning]:bg-green-900/30',
        'data-[state=winning]:animate-pulse',
        isWinning && 'bg-green-100 dark:bg-green-900/30',
        value === 'X' && 'text-primary',
        value === 'O' && 'text-destructive'
      )}
      data-state={isWinning ? 'winning' : 'default'}
      data-position={`${position.row},${position.col}`}
    >
      {value}
    </button>
  );
}