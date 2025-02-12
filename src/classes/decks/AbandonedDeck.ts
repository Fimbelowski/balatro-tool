import { ALL_SUITS } from '../../types/Suit';
import Card from '../Card';
import Deck from './Deck';
import Rank, { ALL_RANKS } from '../../types/Rank';

export default class AbandonedDeck extends Deck {
  constructor() {
    super({
      cardGenerator: () => {
        const filteredRanks = ALL_RANKS.filter(
          (rank) => ![Rank.Jack, Rank.Queen, Rank.King].includes(rank),
        );

        return ALL_SUITS.map((suit) =>
          filteredRanks.map((rank) => new Card(suit, rank)),
        ).flat();
      },
    });
  }
}
