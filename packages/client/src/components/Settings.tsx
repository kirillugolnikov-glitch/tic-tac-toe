import * as React from 'react';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import type { GameConfig } from '@tic-tac-toe/shared';

interface SettingsProps {
  config: GameConfig;
  onConfigChange: (config: Partial<GameConfig>) => void;
  onClose: () => void;
  onReset: (config?: Partial<GameConfig>) => void;
}

export function Settings({ config, onConfigChange, onClose, onReset }: SettingsProps) {
  const [localConfig, setLocalConfig] = React.useState(config);

  React.useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleChange = (key: keyof GameConfig, value: string | number) => {
    const newConfig = { ...localConfig, [key]: value };
    setLocalConfig(newConfig);
    onConfigChange(newConfig);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Настройки
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            ✕
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select
          label="Размер поля"
          value={localConfig.size}
          onChange={(e) => handleChange('size', parseInt(e.target.value))}
        >
          {[3, 4, 5, 6, 7, 8, 9, 10].map((size) => (
            <option key={size} value={size}>
              {size}×{size}
            </option>
          ))}
        </Select>

        <Select
          label="Длина линии для победы"
          value={localConfig.winLength}
          onChange={(e) => handleChange('winLength', parseInt(e.target.value))}
        >
          {Array.from({ length: localConfig.size - 2 }, (_, i) => i + 3).map((len) => (
            <option key={len} value={len}>
              {len} в ряд
            </option>
          ))}
        </Select>

        <Select
          label="Сложность ИИ"
          value={localConfig.aiDifficulty}
          onChange={(e) => handleChange('aiDifficulty', e.target.value as GameConfig['aiDifficulty'])}
        >
          <option value="easy">Лёгкий (случайный)</option>
          <option value="medium">Средний</option>
          <option value="hard">Сложный (Minimax)</option>
        </Select>

        <Select
          label="ИИ играет за"
          value={localConfig.aiPlayer}
          onChange={(e) => handleChange('aiPlayer', e.target.value as GameConfig['aiPlayer'])}
        >
          <option value="X">Крестики (X)</option>
          <option value="O">Нолики (O)</option>
        </Select>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Закрыть
          </Button>
          <Button variant="destructive" className="flex-1" onClick={() => onReset(localConfig)}>
            Новая игра
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}