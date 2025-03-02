import type Card from '../classes/Card';

export default function sortCardsByRankDescending(cards: Card[]) {
  return cards.sort((a, b) => b.rank - a.rank);
}
