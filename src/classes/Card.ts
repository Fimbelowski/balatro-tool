import Rank from '../types/Rank';
import Suit from '../types/Suit';

export default class Card {
  private static nextId = 1;

  public readonly id: number;

  constructor(
    public readonly suit: Suit,
    public readonly rank: Rank,
  ) {
    this.id = Card.nextId;
    Card.nextId++;
  }

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

  public get numericalRank() {
    const ranks = Object.values(Rank);
    return ranks.indexOf(this.rank);
  }

  public get numericalSuit() {
    const suits = Object.values(Suit);
    return suits.indexOf(this.suit);
  }
}
