import Card from './Card';

export default class DrawPile {
  constructor(private cards: Card[]) {}

  public drawCard() {
    return this.cards.pop();
  }
}
