import type Card from '../classes/Card';
import type Suit from '../types/Suit';

export default function filterOutOffSuitCards(cards: Card[], targetSuit: Suit) {
  return cards.filter(({ suit }) => suit === targetSuit);
}
