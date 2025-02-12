import Deck from './Deck';

export default class PaintedDeck extends Deck {
  constructor() {
    super({ handsize: 10 });
  }
}
