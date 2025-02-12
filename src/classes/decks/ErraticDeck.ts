import { ALL_RANKS } from '../../types/Rank';
import { ALL_SUITS } from '../../types/Suit';
import Card from '../Card';
import Deck from './Deck';
import getRandomIntegerInclusive from '../../utils/getRandomIntegerInclusive';

export default class RedDeck extends Deck {
  constructor() {
    super({
      cardGenerator: () => {
        let cards: Card[] = [];

        for (let i = 0; i < 52; i++) {
          const suit =
            ALL_SUITS[getRandomIntegerInclusive(0, ALL_SUITS.length - 1)];
          const rank =
            ALL_RANKS[getRandomIntegerInclusive(0, ALL_RANKS.length - 1)];

          cards.push(new Card(suit, rank));
        }

        return cards;
      },
    });
  }
}
