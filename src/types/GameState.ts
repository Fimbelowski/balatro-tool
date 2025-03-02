import type Card from '../classes/Card';

export default interface GameState {
  cardsRemainingInDrawPile: Card[];
  chipRequirement: number;
  chips: number;
  heldHand: Card[];
  isGameOver: boolean;
  numRemainingDiscards: number;
  numRemainingHands: number;
  round: number;
}
