export function createWinStrategy(size, winLength) {
    return new NInARowWinStrategy(size, winLength);
}
export class NInARowWinStrategy {
    boardSize;
    winLength;
    constructor(boardSize, winLength) {
        this.boardSize = boardSize;
        this.winLength = winLength;
    }
    getName() {
        return `N-in-a-row (${this.winLength})`;
    }
    checkWin(board) {
        const { cells, size } = board;
        const directions = [
            { dr: 0, dc: 1 }, // horizontal
            { dr: 1, dc: 0 }, // vertical
            { dr: 1, dc: 1 }, // diagonal \
            { dr: 1, dc: -1 }, // diagonal /
        ];
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const player = cells[row][col];
                if (player === null)
                    continue;
                for (const { dr, dc } of directions) {
                    const line = this.checkDirection(cells, row, col, dr, dc, player);
                    if (line.length >= this.winLength) {
                        return { winner: player, line: line.slice(0, this.winLength) };
                    }
                }
            }
        }
        return null;
    }
    checkDirection(cells, startRow, startCol, dr, dc, player) {
        const line = [];
        let row = startRow;
        let col = startCol;
        while (row >= 0 &&
            row < this.boardSize &&
            col >= 0 &&
            col < this.boardSize &&
            cells[row][col] === player) {
            line.push({ row, col });
            row += dr;
            col += dc;
        }
        return line;
    }
    checkDraw(board) {
        return board.status === 'in_progress' && board.moveCount === board.size * board.size;
    }
}
export class ClassicWinStrategy {
    strategy;
    constructor(size = 3) {
        this.strategy = new NInARowWinStrategy(size, 3);
    }
    getName() {
        return 'Classic 3-in-a-row';
    }
    checkWin(board) {
        return this.strategy.checkWin(board);
    }
    checkDraw(board) {
        return this.strategy.checkDraw(board);
    }
}
