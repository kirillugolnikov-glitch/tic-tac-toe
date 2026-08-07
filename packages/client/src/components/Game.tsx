import * as React from 'react';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';
import { Board } from './Board';
import { Settings } from './Settings';
import { useTicTacToe } from '../hooks/useTicTacToe';
import type { Player } from '@tic-tac-toe/shared';

export function Game() {
  const {
    boardState,
    config,
    history,
    currentStep,
    makeMove,
    resetGame,
    setConfig,
  } = useTicTacToe();

  const [showSettings, setShowSettings] = React.useState(false);

  const getStatusText = () => {
    switch (boardState.status) {
      case 'won':
        return `Победил ${boardState.winner === 'X' ? '✕' : '⭘'} ${boardState.winner}!`;
      case 'draw':
        return 'Ничья!';
      case 'in_progress':
        return `Ходит ${boardState.currentPlayer === 'X' ? '✕' : '⭘'} ${boardState.currentPlayer}`;
    }
  };

  const getStatusColor = () => {
    switch (boardState.status) {
      case 'won':
        return 'text-green-600 dark:text-green-400';
      case 'draw':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-6">
      <header className="w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight">Крестики-нолики</h1>
        <p className="text-muted-foreground mt-1">Играйте против ИИ на поле любого размера</p>
      </header>

      <Card className="w-full max-w-2xl">
        <CardContent className="space-y-4 p-6">
          <div className={cn('flex items-center justify-between', getStatusColor())}>
            <h2 className="text-xl font-semibold">{getStatusText()}</h2>
            <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
              ⚙️ Настройки
            </Button>
          </div>

          <div className="flex justify-center">
            <Board
              boardState={boardState}
              onCellClick={makeMove}
              disabled={boardState.status !== 'in_progress'}
            />
          </div>

          <div className="flex justify-center">
            <Button variant="secondary" size="sm" onClick={() => resetGame()}>
              Новая игра
            </Button>
          </div>
        </CardContent>
      </Card>

      {showSettings && (
        <Settings
          config={config}
          onConfigChange={setConfig}
          onClose={() => setShowSettings(false)}
          onReset={(newConfig) => {
            resetGame(newConfig);
            setShowSettings(false);
          }}
        />
      )}

      <footer className="text-center text-sm text-muted-foreground">
        <p>История ходов сохраняется в localStorage</p>
      </footer>
    </div>
  );
}