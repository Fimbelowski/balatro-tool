import Deck from './Deck';

export default class RedDeck extends Deck {
  constructor() {
    super({ numDiscards: 3 });
  }
}
