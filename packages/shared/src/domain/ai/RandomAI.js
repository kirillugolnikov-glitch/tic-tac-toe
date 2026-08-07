export class RandomAI {
    getName() {
        return 'Random AI';
    }
    getDifficulty() {
        return 'easy';
    }
    getMove(board, _winStrategy) {
        const emptyCells = [];
        for (let row = 0; row < board.size; row++) {
            for (let col = 0; col < board.size; col++) {
                if (board.cells[row][col] === null) {
                    emptyCells.push({ row, col });
                }
            }
        }
        if (emptyCells.length === 0)
            return null;
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        return emptyCells[randomIndex];
    }
}
export function createAI(difficulty = 'easy') {
    switch (difficulty) {
        case 'easy':
            return new RandomAI();
        case 'medium':
            return new RandomAI();
        case 'hard':
            return new RandomAI();
        default:
            return new RandomAI();
    }
}
