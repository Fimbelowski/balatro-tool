import Deck from './Deck';
import DrawPile from './DrawPile';
import HeldHand from './HeldHand';

export default class Player {
  // Deck
  // Draw Pile
  // Held Hand
  private drawPile: DrawPile;
  public readonly heldHand: HeldHand;

  constructor(private deck: Deck) {
    this.drawPile = this.deck.shuffle();
    this.heldHand = new HeldHand(this.drawPile, deck.handSize);
  }
}
