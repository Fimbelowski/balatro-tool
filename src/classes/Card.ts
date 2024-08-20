import Rank from '../types/Rank';
import rankToString from '../utils/rankToString';
import Suit from '../types/Suit';
import suitToString from '../utils/suitToString';

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
      case Rank.Two:
        return 2;
      case Rank.Three:
        return 3;
      case Rank.Four:
        return 4;
      case Rank.Five:
        return 5;
      case Rank.Six:
        return 6;
      case Rank.Seven:
        return 7;
      case Rank.Eight:
        return 8;
      case Rank.Nine:
        return 9;
      case Rank.Ten:
      case Rank.Jack:
      case Rank.Queen:
      case Rank.King:
        return 10;
      case Rank.Ace:
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

  public toString() {
    return `${rankToString(this.rank)}${suitToString(this.suit)}`;
  }
}
