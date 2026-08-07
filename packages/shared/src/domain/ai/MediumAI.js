import { RandomAI } from './RandomAI';
import { MinimaxAI } from './MinimaxAI';
export class MediumAI {
    randomAI;
    minimaxAI;
    useMinimaxProbability = 0.7;
    constructor(useMinimaxProbability = 0.7) {
        this.randomAI = new RandomAI();
        this.minimaxAI = new MinimaxAI();
        this.useMinimaxProbability = useMinimaxProbability;
    }
    getName() {
        return 'Medium AI';
    }
    getDifficulty() {
        return 'medium';
    }
    getMove(board, winStrategy) {
        // 70% chance to use minimax, 30% random
        if (Math.random() < this.useMinimaxProbability) {
            return this.minimaxAI.getMove(board, winStrategy);
        }
        return this.randomAI.getMove(board, winStrategy);
    }
}
