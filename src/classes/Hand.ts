import type Card from './Card';
import PokerHand from '../types/PokerHand';
import Rank, { ALL_RANKS, RANK_INDEX_OFFSET } from '../types/Rank';
import { ALL_SUITS } from '../types/Suit';

export default abstract class Hand {
  constructor(public readonly cards: Card[]) {}

  public static containsFiveOfAKind(cards: Card[]) {
    const rankFrequencies = Hand.getRankFrequencies(cards);

    for (const rankFrequency of rankFrequencies) {
      if (rankFrequency >= 5) {
        return true;
      }
    }

    return false;
  }

  public static containsFlush(cards: Card[]) {
    const suitFrequencies = Hand.getSuitFrequencies(cards);

    for (const suitFrequency of suitFrequencies) {
      if (suitFrequency >= 5) {
        return true;
      }
    }

    return false;
  }

  public static containsFlushFive(cards: Card[]) {
    const cardsGroupedBySuit = Hand.groupCardsBySuit(cards).filter(
      (group) => group.length >= 5,
    );

    return cardsGroupedBySuit.some((group) => Hand.containsFiveOfAKind(group));
  }

  public static containsFlushHouse(cards: Card[]) {
    const cardsGroupedBySuit = Hand.groupCardsBySuit(cards).filter(
      (group) => group.length >= 5,
    );

    return cardsGroupedBySuit.some((group) => Hand.containsFullHouse(group));
  }

  public static containsFourOfAKind(cards: Card[]) {
    const rankFrequencies = Hand.getRankFrequencies(cards);

    for (const rankFrequency of rankFrequencies) {
      if (rankFrequency >= 4) {
        return true;
      }
    }

    return false;
  }

  public static containsFullHouse(cards: Card[]) {
    const rankFrequencies = Hand.getRankFrequencies(cards);

    const pairedRanks = new Set<Rank>();
    const theeOfAKindRanks = new Set<Rank>();

    for (let i = 0; i < rankFrequencies.length; i++) {
      const rankFrequency = rankFrequencies[i];

      if (rankFrequency >= 2) {
        pairedRanks.add(rankFrequency + RANK_INDEX_OFFSET);
      }

      if (rankFrequency >= 3) {
        theeOfAKindRanks.add(rankFrequency + RANK_INDEX_OFFSET);
      }
    }

    return theeOfAKindRanks.size >= 1 && pairedRanks.size >= 2;
  }

  public static containsPair(cards: Card[]) {
    const rankFrequencies = Hand.getRankFrequencies(cards);

    for (const rankFrequency of rankFrequencies) {
      if (rankFrequency >= 2) {
        return true;
      }
    }

    return false;
  }

  public static containsStraight(cards: Card[]) {
    const buckets: Rank[][] = [];

    let containsAce = false;

    for (let i = 0; i < ALL_RANKS.length; i++) {
      buckets.push([]);
    }

    for (const { rank } of cards) {
      const bucket = buckets[rank - RANK_INDEX_OFFSET];

      if (bucket.length === 0) {
        bucket.push(rank);
      }

      if (rank === Rank.Ace) {
        containsAce = true;
      }
    }

    const sortedDistinctRanks = Array.prototype.concat(...buckets);

    let left = 0;
    let right = 1;

    while (left < sortedDistinctRanks.length - 4) {
      if (sortedDistinctRanks[right] - sortedDistinctRanks[right - 1] === 1) {
        right++;
      } else {
        left++;
        right = left + 1;
      }

      const straightLength = right - left;

      if (
        straightLength === 5 ||
        (sortedDistinctRanks[left] === Rank.Two &&
          straightLength === 4 &&
          containsAce)
      ) {
        return true;
      }
    }

    return false;
  }

  public static containsStraightFlush(cards: Card[]) {
    const cardsGroupedBySuit = Hand.groupCardsBySuit(cards).filter(
      (group) => group.length >= 5,
    );

    for (const suitedCards of cardsGroupedBySuit) {
      if (suitedCards.length >= 5 && Hand.containsStraight(suitedCards)) {
        return true;
      }
    }

    return false;
  }

  public static containsThreeOfAKind(cards: Card[]) {
    const rankFrequencies = Hand.getRankFrequencies(cards);

    for (const rankFrequency of rankFrequencies) {
      if (rankFrequency >= 3) {
        return true;
      }
    }

    return false;
  }

  public static containsTwoPair(cards: Card[]) {
    const rankFrequencies = Hand.getRankFrequencies(cards);

    let numPairs = 0;

    for (const rankFrequency of rankFrequencies) {
      if (rankFrequency >= 2) {
        numPairs++;
      }
    }

    return numPairs >= 2;
  }

  public getHighestRankingPokerHand() {
    if (Hand.containsFlushFive(this.cards)) {
      return PokerHand.FlushFive;
    }

    if (Hand.containsFlushHouse(this.cards)) {
      return PokerHand.FlushHouse;
    }

    if (Hand.containsFiveOfAKind(this.cards)) {
      return PokerHand.FiveOfAKind;
    }

    if (Hand.containsStraightFlush(this.cards)) {
      return PokerHand.StraightFlush;
    }

    if (Hand.containsFourOfAKind(this.cards)) {
      return PokerHand.FourOfAKind;
    }

    if (Hand.containsFullHouse(this.cards)) {
      return PokerHand.FullHouse;
    }

    if (Hand.containsFlush(this.cards)) {
      return PokerHand.Flush;
    }

    if (Hand.containsStraight(this.cards)) {
      return PokerHand.Straight;
    }

    if (Hand.containsThreeOfAKind(this.cards)) {
      return PokerHand.ThreeOfAKind;
    }

    if (Hand.containsTwoPair(this.cards)) {
      return PokerHand.TwoPair;
    }

    if (Hand.containsPair(this.cards)) {
      return PokerHand.Pair;
    }

    return PokerHand.HighCard;
  }

  public static getRankFrequencies(cards: Card[]) {
    const rankFrequencies: number[] = Array(ALL_RANKS.length).fill(0);

    for (const { rank } of cards) {
      rankFrequencies[rank - RANK_INDEX_OFFSET]++;
    }

    return rankFrequencies;
  }

  public static getSuitFrequencies(cards: Card[]) {
    const suitFrequencies = Array(ALL_SUITS.length).fill(0);

    for (const { suit } of cards) {
      suitFrequencies[suit]++;
    }

    return suitFrequencies;
  }

  public static groupCardsBySuit(cards: Card[]) {
    const buckets: Card[][] = [];

    for (let i = 0; i < ALL_SUITS.length; i++) {
      buckets.push([]);
    }

    for (const card of cards) {
      buckets[card.suit].push(card);
    }

    return buckets;
  }
}
