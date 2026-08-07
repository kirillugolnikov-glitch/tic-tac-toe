export function createEmptyBoard(size) {
    return Array.from({ length: size }, () => Array(size).fill(null));
}
export function createInitialBoardState(size) {
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
export function cloneBoard(cells) {
    return cells.map(row => [...row]);
}
export function cloneBoardState(state) {
    return {
        ...state,
        cells: cloneBoard(state.cells),
        winningLine: state.winningLine ? [...state.winningLine] : null,
    };
}
export function getCell(state, row, col) {
    return state.cells[row]?.[col] ?? null;
}
export function isValidMove(state, row, col) {
    return (state.status === 'in_progress' &&
        row >= 0 &&
        row < state.size &&
        col >= 0 &&
        col < state.size &&
        state.cells[row][col] === null);
}
export function applyMove(state, row, col) {
    if (!isValidMove(state, row, col)) {
        return state;
    }
    const newState = cloneBoardState(state);
    newState.cells[row][col] = state.currentPlayer;
    newState.moveCount += 1;
    newState.currentPlayer = state.currentPlayer === 'X' ? 'O' : 'X';
    return newState;
}
export function switchPlayer(player) {
    return player === 'X' ? 'O' : 'X';
}
