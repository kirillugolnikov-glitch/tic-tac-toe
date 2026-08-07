export * from './domain/entities/Board';
export * from './domain/strategies/WinStrategy';
export * from './domain/ai/RandomAI';
export * from './domain/ai/MediumAI';
export * from './domain/ai/MinimaxAI';
export * from './domain/GameEngine';
export * from './ports/GameRepository';
export * from './adapters/LocalStorageRepo';

// Zod schemas (explicit to avoid conflicts with domain types)
export {
  CellValueSchema,
  PlayerSchema,
  GameStatusSchema,
  PositionSchema,
  WinResultSchema,
  BoardStateSchema,
  GameConfigSchema,
  GameRecordSchema,
  CreateGameRequestSchema,
  MakeMoveRequestSchema,
  GameResponseSchema,
  StatsResponseSchema,
  MoveHistoryItemSchema,
  type CellValue,
  type Player,
  type GameStatus,
  type Position,
  type WinResult,
  type BoardState,
  type GameConfig,
  type GameRecord,
  type CreateGameRequest,
  type MakeMoveRequest,
  type GameResponse,
  type StatsResponse,
  type MoveHistoryItem,
} from './schemas/game.zod';