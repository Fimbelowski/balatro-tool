import type Card from '../classes/Card';
import type GameState from './GameState';

type GameAction = 'discardHand' | 'playHand';

export type Strategy = (gameState: GameState) => [GameAction, Card[]];
export type StrategyParams = Parameters<Strategy>;
export type StrategyReturnType = ReturnType<Strategy>;
