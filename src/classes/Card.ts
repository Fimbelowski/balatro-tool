import Rank from '../types/Rank';
import type Suit from '../types/Suit';

export default class Card {
  constructor(
    public readonly suit: Suit,
    public readonly rank: Rank,
  ) {}

  public get chipValue() {
    switch (this.rank) {
      case Rank.TWO:
        return 2;
      case Rank.THREE:
        return 3;
      case Rank.FOUR:
        return 4;
      case Rank.FIVE:
        return 5;
      case Rank.SIX:
        return 6;
      case Rank.SEVEN:
        return 7;
      case Rank.EIGHT:
        return 8;
      case Rank.NINE:
        return 9;
      case Rank.TEN:
      case Rank.JACK:
      case Rank.QUEEN:
      case Rank.KING:
        return 10;
      case Rank.ACE:
        return 11;
    }
  }
}
