import Card from '../classes/Card';
import Rank from '../types/Rank';
import Suit from '../types/Suit';

export default function createStandardPlayingCards() {
  const cards: Card[] = [];

  Object.values(Suit).forEach((suit) => {
    Object.values(Rank).forEach((rank) => {
      cards.push(new Card(suit, rank));
    });
  });

  return cards;
}
