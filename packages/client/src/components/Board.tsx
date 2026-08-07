import * as React from 'react';
import { cn } from '../lib/utils';
import { Cell } from './Cell';
import type { BoardState, Position } from '@tic-tac-toe/shared';

interface BoardProps {
  boardState: BoardState;
  onCellClick: (row: number, col: number) => void;
  disabled?: boolean;
}

export function Board({ boardState, onCellClick, disabled }: BoardProps) {
  const { size, cells, winningLine } = boardState;
  const winningPositions = new Set(winningLine?.map((p) => `${p.row},${p.col}`) ?? []);

  return (
    <div
      className={cn('gap-1 p-1 bg-border rounded-lg', 'grid')}
      role="grid"
      aria-label={`Игровое поле ${size}×${size}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${size}, minmax(60px, 1fr))`,
        gridTemplateRows: `repeat(${size}, minmax(60px, 1fr))`,
      } as React.CSSProperties}
    >
      {cells.map((row, rowIndex) =>
        row.map((cellValue, colIndex) => {
          const position: Position = { row: rowIndex, col: colIndex };
          const isWinning = winningPositions.has(`${rowIndex},${colIndex}`);

          return (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={cellValue}
              position={position}
              onClick={() => onCellClick(rowIndex, colIndex)}
              isWinning={isWinning}
              disabled={disabled}
            />
          );
        })
      )}
    </div>
  );
}