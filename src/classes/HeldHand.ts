import type Card from './Card';
import DrawPile from './DrawPile';

export default class HeldHand {
  private currentHand: Card[];

  constructor(
    private drawPile: DrawPile,
    private handSize: number,
  ) {
    this.currentHand = [];
    this.drawUntilHandIsFull();
  }

  drawUntilHandIsFull() {
    while (this.currentHand.length < this.handSize) {
      const drawnCard = this.drawPile.drawCard();

      if (drawnCard === undefined) {
        break;
      }

      this.currentHand.push(drawnCard);
    }
  }
}
