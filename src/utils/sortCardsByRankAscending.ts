import type Card from '../classes/Card';

export default function sortCardsByRankAscending(cards: Card[]) {
  return cards.sort((a, b) => a.rank - b.rank);
}
