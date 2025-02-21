import type CardOrCards from './CardOrCards';

export default interface GameActions {
  discardHand: (cardOrCards: CardOrCards) => void;
  playHand: (cardOrCards: CardOrCards) => void;
}
