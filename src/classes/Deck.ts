import type Card from './Card';
import DrawPile from './DrawPile';
import getRandomIntegerInclusive from '../utils/getRandomIntegerInclusive';

export default class Deck {
  constructor(
    protected cards: Card[],
    public handSize: number,
    public numHands: number,
    public numDiscards: number,
  ) {}

  public shuffle() {
    const shuffledCards: Card[] = [...this.cards];

    for (let i = shuffledCards.length - 1; i >= 1; i--) {
      const j = getRandomIntegerInclusive(0, i);
      const temp = shuffledCards[i];
      shuffledCards.splice(i, 1, shuffledCards[j]);
      shuffledCards.splice(j, 1, temp);
    }

    return new DrawPile(shuffledCards);
  }
}
