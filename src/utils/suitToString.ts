import Suit from '../types/Suit';

export default function suitToString(suit: Suit) {
  switch (suit) {
    case Suit.Spades:
      return '♠';
    case Suit.Hearts:
      return '♥';
    case Suit.Clubs:
      return '♣';
    case Suit.Diamonds:
      return '♦';
  }
}
