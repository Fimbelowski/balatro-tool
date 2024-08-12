import Deck from './Deck';
import DrawPile from './DrawPile';
import HeldHand from './HeldHand';

export default class Player {
  // Deck
  // Draw Pile
  // Held Hand
  private drawPile: DrawPile;
  private heldHand: HeldHand;

  constructor(private deck: Deck) {
    this.drawPile = deck.shuffle();
    this.heldHand = new HeldHand(this.drawPile, deck.handSize);
    console.log(this.heldHand);
  }
}
