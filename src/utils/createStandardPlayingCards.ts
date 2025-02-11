import Card from '../classes/Card';
import { ALL_RANKS } from '../types/Rank';
import { ALL_SUITS } from '../types/Suit';

export default function createStandardPlayingCards() {
  return ALL_SUITS.map((suit) =>
    ALL_RANKS.map((rank) => new Card(suit, rank)),
  ).flat();
}
