export default interface GameActions {
  discardHand: (cardIds: number[]) => void;
  // getRemainingCards: () => void;
  playHand: (cardIds: number[]) => void;
}
