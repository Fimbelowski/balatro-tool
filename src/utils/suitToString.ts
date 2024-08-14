import Suit from '../types/Suit';

export default function suitToString(suit: Suit) {
  switch (suit) {
    case Suit.SPADES:
      return '♠';
    case Suit.HEARTS:
      return '♥';
    case Suit.CLUBS:
      return '♣';
    case Suit.DIAMONDS:
      return '♦';
  }
}
