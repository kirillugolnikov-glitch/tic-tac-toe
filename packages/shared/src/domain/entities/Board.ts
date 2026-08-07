export type CellValue = 'X' | 'O' | null;

export type Player = 'X' | 'O';

export type GameStatus = 'in_progress' | 'won' | 'draw';

export interface Position {
  row: number;
  col: number;
}

export interface WinResult {
  winner: Player;
  line: Position[];
}

export interface BoardState {
  size: number;
  cells: CellValue[][];
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
  winningLine: Position[] | null;
  moveCount: number;
}

export function createEmptyBoard(size: number): CellValue[][] {
  return Array.from({ length: size }, () => Array(size).fill(null));
}

export function createInitialBoardState(size: number): BoardState {
  return {
    size,
    cells: createEmptyBoard(size),
    currentPlayer: 'X',
    status: 'in_progress',
    winner: null,
    winningLine: null,
    moveCount: 0,
  };
}

export function cloneBoard(cells: CellValue[][]): CellValue[][] {
  return cells.map(row => [...row]);
}

export function cloneBoardState(state: BoardState): BoardState {
  return {
    ...state,
    cells: cloneBoard(state.cells),
    winningLine: state.winningLine ? [...state.winningLine] : null,
  };
}

export function getCell(state: BoardState, row: number, col: number): CellValue {
  return state.cells[row]?.[col] ?? null;
}

export function isValidMove(state: BoardState, row: number, col: number): boolean {
  return (
    state.status === 'in_progress' &&
    row >= 0 &&
    row < state.size &&
    col >= 0 &&
    col < state.size &&
    state.cells[row][col] === null
  );
}

export function applyMove(state: BoardState, row: number, col: number): BoardState {
  if (!isValidMove(state, row, col)) {
    return state;
  }

  const newState = cloneBoardState(state);
  newState.cells[row][col] = state.currentPlayer;
  newState.moveCount += 1;
  newState.currentPlayer = state.currentPlayer === 'X' ? 'O' : 'X';

  return newState;
}

export function switchPlayer(player: Player): Player {
  return player === 'X' ? 'O' : 'X';
}