import Card from './Card';
import createFrequencyMap from '../utils/createFrequencyMap';
import getRandomIntegerInclusive from '../utils/getRandomIntegerInclusive';
import mapGetValueOrThrow from '../utils/mapGetValueOrThrow';
import Rank, { ALL_RANKS } from '../types/Rank';
import Suit, { ALL_SUITS } from '../types/Suit';

export default class DrawPile {
  private cards: Card[];

  constructor(unShuffledCards: Card[]) {
    this.cards = this.shuffleCards(unShuffledCards);
  }

  public drawCards(numCards: number) {
    return this.cards.splice(this.cards.length - 1 - numCards, numCards);
  }

  public get remainingCards() {
    const suitToRankToFrequency = new Map<Suit, Map<Rank, number>>();

    // Set all suits, ranks, and frequencies first to that insert order doesn't reveal information about the draw pile.
    ALL_SUITS.forEach((suit) => {
      suitToRankToFrequency.set(
        suit,
        createFrequencyMap(ALL_RANKS, (rank) => rank),
      );
    });

    this.cards.forEach(({ rank, suit }) => {
      const rankToFrequency = mapGetValueOrThrow(
        suitToRankToFrequency,
        suit,
        `Suit ${suit} not found.`,
      );

      const frequency = mapGetValueOrThrow(
        rankToFrequency,
        rank,
        `rank ${rank} not found.`,
      );

      rankToFrequency.set(rank, frequency + 1);
    });

    return suitToRankToFrequency;
  }

  private shuffleCards(unshuffledCards: Card[]) {
    const shuffledCards = [...unshuffledCards];

    for (let i = shuffledCards.length - 1; i >= 1; i--) {
      const j = getRandomIntegerInclusive(0, i);
      const temp = shuffledCards[i];
      shuffledCards.splice(i, 1, shuffledCards[j]);
      shuffledCards.splice(j, 1, temp);
    }

    return shuffledCards;
  }
}
