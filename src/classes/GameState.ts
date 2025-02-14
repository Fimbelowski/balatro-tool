import Card from './Card';
import Deck from './decks/Deck';
import DrawPile from './DrawPile';
import RedDeck from './decks/RedDeck';

export default class GameState {
  private _currentDeck: Deck = new RedDeck();
  private drawPile = new DrawPile([]);
  private _heldHand: Card[] = [];

  constructor() {}

  public get hand() {
    return [...this._heldHand];
  }

  public startRun(deck: Deck) {
    this._currentDeck = deck;

    const { cards, handSize } = this._currentDeck;

    this.drawPile = new DrawPile(cards);
    this._heldHand = this.drawPile.drawCards(handSize);
  }

  public scoreHand(cards: Card[]) {}
}
