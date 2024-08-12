import type Card from './Card';
import DrawPile from './DrawPile';

export default class HeldHand {
  public readonly currentHand: Card[];

  constructor(
    private drawPile: DrawPile,
    private handSize: number,
  ) {
    this.currentHand = [];
    this.drawUntilHandIsFull();
  }

  discard(cardIds: number[]) {
    cardIds.forEach((cardId) => {
      this.discardCard(cardId);
    });

    this.drawUntilHandIsFull();
  }

  private discardCard(cardId: number) {
    const index = this.currentHand.findIndex(({id}) => id === cardId);

    if (index === undefined) {
      throw Error(`Card id ${cardId} not found.`);
    }

    this.currentHand.splice(index, 1);
  }

  private drawUntilHandIsFull() {
    while (this.currentHand.length < this.handSize) {
      const drawnCard = this.drawPile.drawCard();

      if (drawnCard === undefined) {
        break;
      }

      this.currentHand.push(drawnCard);
    }
  }
}
