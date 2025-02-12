import Card from './Card';
import getRandomIntegerInclusive from '../utils/getRandomIntegerInclusive';

export default class DrawPile {
  private cards: Card[];

  constructor(unShuffledCards: Card[]) {
    this.cards = this.shuffleCards(unShuffledCards);
  }

  public drawCards(numCards: number) {
    return this.cards.splice(this.cards.length - 1 - numCards, numCards);
  }

  private shuffleCards(unShuffledCards: Card[]) {
    const shuffledCards = [...unShuffledCards];

    for (let i = shuffledCards.length - 1; i >= 1; i--) {
      const j = getRandomIntegerInclusive(0, i);
      const temp = shuffledCards[i];
      shuffledCards.splice(i, 1, shuffledCards[j]);
      shuffledCards.splice(j, 1, temp);
    }

    return shuffledCards;
  }
}
