import type Card from '../classes/Card';

export default interface GameState {
  chipRequirement: number;
  chips: number;
  heldHand: Card[];
  isGameOver: boolean;
  numRemainingDiscards: number;
  numRemainingHands: number;
  round: number;
}
