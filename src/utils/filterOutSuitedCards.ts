import type Card from '../classes/Card';
import type Suit from '../types/Suit';

export default function filterOutSuitedCards(cards: Card[], suitToAvoid: Suit) {
  return cards.filter(({ suit }) => suit !== suitToAvoid);
}
