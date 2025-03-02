import Card from './Card';
import getRandomIntegerInclusive from '../utils/getRandomIntegerInclusive';

export default class DrawPile {
  private cards: Card[];

  constructor(unShuffledCards: Card[]) {
    this.cards = this.shuffleCards(unShuffledCards);
  }

  public drawCards(numCards: number) {
    const drawnCards = [];

    for (let i = 0; i < numCards; i++) {
      const drawnCard = this.cards.pop();

      if (drawnCard === undefined) {
        return drawnCards;
      }

      drawnCards.push(drawnCard);
    }

    return drawnCards;
  }

  public get remainingCards() {
    return this.cards;
  }

  private shuffleCards(unshuffledCards: Card[]) {
    const shuffledCards = [...unshuffledCards];

    for (let i = shuffledCards.length - 1; i >= 1; i--) {
      const j = getRandomIntegerInclusive(0, i);
      const temp = shuffledCards[i];
      shuffledCards.splice(i, 1, shuffledCards[j]);
      shuffledCards.splice(j, 1, temp);
    }

    return shuffledCards;
  }
}
