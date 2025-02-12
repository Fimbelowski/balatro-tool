import { ALL_RANKS } from '../../types/Rank';
import Card from '../Card';
import Deck from './Deck';
import Suit from '../../types/Suit';

export default class RedDeck extends Deck {
  constructor() {
    super({
      cardGenerator: () =>
        [Suit.Spades, Suit.Spades, Suit.Hearts, Suit.Hearts]
          .map((suit) => ALL_RANKS.map((rank) => new Card(suit, rank)))
          .flat(),
    });
  }
}
