import type Card from '../classes/Card';
import type GameActions from './GameActions';
import type GameState from './GameState';

type GameAction = 'discardHand' | 'playHand';

export type Strategy = (
  gameState: GameState,
  gameActions: GameActions,
) => [GameAction, Card[]];
export type StrategyParams = Parameters<Strategy>;
export type StrategyReturnType = ReturnType<Strategy>;
