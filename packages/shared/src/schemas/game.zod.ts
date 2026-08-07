import { z } from 'zod';

export const CellValueSchema = z.enum(['X', 'O', 'null']).nullable();
export type CellValue = z.infer<typeof CellValueSchema>;

export const PlayerSchema = z.enum(['X', 'O']);
export type Player = z.infer<typeof PlayerSchema>;

export const GameStatusSchema = z.enum(['in_progress', 'won', 'draw']);
export type GameStatus = z.infer<typeof GameStatusSchema>;

export const PositionSchema = z.object({
  row: z.number().int().min(0),
  col: z.number().int().min(0),
});
export type Position = z.infer<typeof PositionSchema>;

export const WinResultSchema = z.object({
  winner: PlayerSchema,
  line: z.array(PositionSchema),
});
export type WinResult = z.infer<typeof WinResultSchema>;

export const BoardStateSchema = z.object({
  size: z.number().int().min(3).max(10),
  cells: z.array(z.array(CellValueSchema)),
  currentPlayer: PlayerSchema,
  status: GameStatusSchema,
  winner: PlayerSchema.nullable(),
  winningLine: z.array(PositionSchema).nullable(),
  moveCount: z.number().int().min(0),
});
export type BoardState = z.infer<typeof BoardStateSchema>;

export const GameConfigSchema = z.object({
  size: z.number().int().min(3).max(10).default(3),
  winLength: z.number().int().min(3).max(10).default(3),
  aiDifficulty: z.enum(['easy', 'medium', 'hard']).default('easy'),
  aiPlayer: PlayerSchema.default('O'),
});
export type GameConfig = z.infer<typeof GameConfigSchema>;

export const GameRecordSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  config: GameConfigSchema,
  finalState: BoardStateSchema,
  winner: PlayerSchema.nullable(),
  moveCount: z.number().int().min(0),
});
export type GameRecord = z.infer<typeof GameRecordSchema>;

export const CreateGameRequestSchema = z.object({
  config: GameConfigSchema.optional(),
});
export type CreateGameRequest = z.infer<typeof CreateGameRequestSchema>;

export const MakeMoveRequestSchema = z.object({
  gameId: z.string(),
  row: z.number().int().min(0),
  col: z.number().int().min(0),
});
export type MakeMoveRequest = z.infer<typeof MakeMoveRequestSchema>;

export const GameResponseSchema = z.object({
  game: GameRecordSchema,
});
export type GameResponse = z.infer<typeof GameResponseSchema>;

export const StatsResponseSchema = z.object({
  totalGames: z.number().int().min(0),
  xWins: z.number().int().min(0),
  oWins: z.number().int().min(0),
  draws: z.number().int().min(0),
});
export type StatsResponse = z.infer<typeof StatsResponseSchema>;

export const MoveHistoryItemSchema = z.object({
  step: z.number().int().min(0),
  board: BoardStateSchema,
  player: PlayerSchema,
  position: PositionSchema,
});
export type MoveHistoryItem = z.infer<typeof MoveHistoryItemSchema>;