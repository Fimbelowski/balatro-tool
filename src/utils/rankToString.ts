import Rank from '../types/Rank';

export default function rankToString(rank: Rank) {
  switch (rank) {
    case Rank.ACE:
      return 'A';
    case Rank.KING:
      return 'K';
    case Rank.QUEEN:
      return 'Q';
    case Rank.JACK:
      return 'J';
    case Rank.TEN:
      return '10';
    case Rank.NINE:
      return '9';
    case Rank.EIGHT:
      return '8';
    case Rank.SEVEN:
      return '7';
    case Rank.SIX:
      return '6';
    case Rank.FIVE:
      return '5';
    case Rank.FOUR:
      return '4';
    case Rank.THREE:
      return '3';
    case Rank.TWO:
      return '2';
  }
}
