import type Card from '../classes/Card';
import type Rank from './Rank';
import type Suit from './Suit';

export default interface GameState {
  cardsRemainingInDrawPile: Map<Suit, Map<Rank, number>>;
  chipRequirement: number;
  chips: number;
  heldHand: Card[];
  isGameOver: boolean;
  numRemainingDiscards: number;
  numRemainingHands: number;
  round: number;
}
