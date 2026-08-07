# Tic-Tac-Toe Monorepo

Современная реализация крестиков-ноликов с настраиваемым размером поля, ИИ и сохранением статистики.

## 🏗 Архитектура

```
tic-tac-toe/
├── packages/
│   ├── shared/     # Чистая логика игры (TypeScript, Zod, Vitest)
│   ├── client/     # React 18 + Vite + Tailwind + Zustand
│   └── server/     # Bun + Fastify + Prisma + SQLite
├── .github/workflows/  # CI/CD для GitHub Pages
└── package.json        # Bun workspaces
```

## 🚀 Быстрый старт

### Предварительные требования
- [Bun](https://bun.sh/) ≥ 1.1
- Node.js ≥ 20 (альтернатива)

### Установка
```bash
# Клонирование
git clone <repo-url>
cd tic-tac-toe

# Установка зависимостей
bun install

# Генерация Prisma клиента
bun run db:generate

# Запуск в разработке (в 3 терминалах)
bun run dev:client   # http://localhost:3000
bun run dev:server   # http://localhost:4000
```

## 🎮 Функциональность MVP

- ✅ Настраиваемое поле **N×N** (3–10)
- ✅ Длина выигрышной линии **3–N**
- ✅ **Single player** против ИИ (уровень: лёгкий/рандом)
- ✅ История ходов с **time-travel** (undo/redo/прыжок к ходу)
- ✅ Счётчик побед/ничей (localStorage + SQLite)
- ✅ Адаптивный UI (Tailwind + shadcn/ui-подобные компоненты)
- ✅ Тёмная тема (CSS variables)

## 📦 Скрипты

```bash
# Разработка
bun run dev:client    # Клиент на :3000
bun run dev:server    # Сервер на :4000

# Сборка
bun run build         # Всё
bun run build:shared  # Только shared
bun run build:client  # Только клиент
bun run build:server  # Только сервер

# Тесты и линтинг
bun run test          # Все тесты
bun run test:shared   # Тесты shared
bun run lint          # Oxlint
bun run format        # Oxfmt

# База данных
bun run db:push       # Prisma db push
bun run db:studio     # Prisma Studio
bun run db:generate   # Prisma generate
```

## 🌐 Деплой

### GitHub Pages (только клиент)
1. Включите GitHub Pages в настройках репозитория (Source: GitHub Actions)
2. Пуш в `main` автоматически деплоит `packages/client/dist`

### Telegram Mini App
1. Создайте бота через @BotFather
2. Настройте Web App URL (GitHub Pages / Vercel / свой домен)
3. Добавьте в `.env`:
   ```env
   TELEGRAM_BOT_TOKEN=your_token
   TELEGRAM_WEBHOOK_URL=https://your-domain.com
   ```
4. Клиент автоматически определяет Telegram WebView и применяет тему

### Полный стек (Vercel / Railway / Fly.io / VPS)
```bash
# Сборка
bun run build

# Запуск сервера
cd packages/server && bun start
```

## 🧪 Тестирование

```bash
# Unit-тесты shared пакета
bun run test:shared

# Покрытие кода
cd packages/shared && bun test --coverage
```

## 📁 Структура shared пакета

```
shared/src/
├── domain/
│   ├── entities/Board.ts      # BoardState, CellValue, Player, операции
│   ├── strategies/WinStrategy.ts  # Интерфейс + ClassicWin, NInARowWin
│   ├── ai/RandomAI.ts         # AIMoveStrategy интерфейс + реализация
│   └── GameEngine.ts          # История, undo/redo, AI ходы
├── ports/GameRepository.ts    # Интерфейс репозитория
├── adapters/LocalStorageRepo.ts  # Реализация для клиента
├── schemas/game.zod.ts        # Zod схемы (общие типы + валидация)
└── index.ts                   # Barrel export
```

## 🔧 Расширение

### Добавление нового ИИ
```typescript
// shared/src/domain/ai/MinimaxAI.ts
import { AIMoveStrategy } from './RandomAI';

export class MinimaxAI implements AIMoveStrategy {
  getName() { return 'Minimax AI'; }
  getDifficulty() { return 'hard' as const; }
  getMove(board, winStrategy) { /* ... */ }
}
```

### Добавление варианта поля (Гомоку, Connect-4)
```typescript
// shared/src/domain/strategies/Connect4Win.ts
export class Connect4WinStrategy implements WinStrategy {
  // Гравитация: фишки падают вниз
}
```

## 📄 Лицензия

MIT