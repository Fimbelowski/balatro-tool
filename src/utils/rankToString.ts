import Rank from '../types/Rank';

export default function rankToString(rank: Rank) {
  switch (rank) {
    case Rank.Ace:
      return 'A';
    case Rank.King:
      return 'K';
    case Rank.Queen:
      return 'Q';
    case Rank.Jack:
      return 'J';
    case Rank.Ten:
      return '10';
    case Rank.Nine:
      return '9';
    case Rank.Eight:
      return '8';
    case Rank.Seven:
      return '7';
    case Rank.Six:
      return '6';
    case Rank.Five:
      return '5';
    case Rank.Four:
      return '4';
    case Rank.Three:
      return '3';
    case Rank.Two:
      return '2';
  }
}
