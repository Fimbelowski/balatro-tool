import type Card from './Card';
import PokerHand from '../types/PokerHand';
import radixSort from '../utils/radixSort';
import Rank, { ALL_RANKS } from '../types/Rank';
import { ALL_SUITS } from '../types/Suit';

const sortedCardsToPokerHand = new Map<string, PokerHand>();

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
    const cardsGroupedBySuit = Hand.groupCardsBySuit(cards);

    for (const suitedCards of cardsGroupedBySuit) {
      if (suitedCards.length >= 5 && Hand.containsFiveOfAKind(suitedCards)) {
        return true;
      }
    }

    return false;
  }

  public static containsFlushHouse(cards: Card[]) {
    const cardsGroupedBySuit = Hand.groupCardsBySuit(cards);

    for (const suitedCards of cardsGroupedBySuit) {
      if (suitedCards.length >= 5 && Hand.containsFullHouse(suitedCards)) {
        return true;
      }
    }

    return false;
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
        pairedRanks.add(rankFrequency);
      }

      if (rankFrequency >= 3) {
        theeOfAKindRanks.add(rankFrequency);
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

    for (const { rank, zeroIndexedRank } of cards) {
      const bucket = buckets[zeroIndexedRank];

      if (bucket.length === 0) {
        bucket.push(zeroIndexedRank);
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
    const cardsGroupedBySuit = Hand.groupCardsBySuit(cards);

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

  public getHighestRankingPokerHand(omitSecretHandTypes = true) {
    const cardsAsNumbers = this.cards.map(
      ({ numericalRepresentation }) => numericalRepresentation,
    );

    const sortedCardsAsNumbers = radixSort(cardsAsNumbers);
    const hash = sortedCardsAsNumbers
      .map((number) => number.toString().padStart(2, '0'))
      .join('');

    const pokerHandFromLookup = sortedCardsToPokerHand.get(hash);

    if (pokerHandFromLookup !== undefined) {
      return pokerHandFromLookup;
    }

    let pokerHand = PokerHand.HighCard;

    if (!omitSecretHandTypes) {
      if (Hand.containsFlushFive(this.cards)) {
        pokerHand = PokerHand.FlushFive;
      } else if (Hand.containsFlushHouse(this.cards)) {
        pokerHand = PokerHand.FlushHouse;
      } else if (Hand.containsFiveOfAKind(this.cards)) {
        pokerHand = PokerHand.FiveOfAKind;
      }
    }

    if (Hand.containsStraightFlush(this.cards)) {
      pokerHand = PokerHand.StraightFlush;
    } else if (Hand.containsFourOfAKind(this.cards)) {
      pokerHand = PokerHand.FourOfAKind;
    } else if (Hand.containsFullHouse(this.cards)) {
      pokerHand = PokerHand.FullHouse;
    } else if (Hand.containsFlush(this.cards)) {
      pokerHand = PokerHand.Flush;
    } else if (Hand.containsStraight(this.cards)) {
      pokerHand = PokerHand.Straight;
    } else if (Hand.containsThreeOfAKind(this.cards)) {
      pokerHand = PokerHand.ThreeOfAKind;
    } else if (Hand.containsTwoPair(this.cards)) {
      pokerHand = PokerHand.TwoPair;
    } else if (Hand.containsPair(this.cards)) {
      pokerHand = PokerHand.Pair;
    }

    sortedCardsToPokerHand.set(hash, pokerHand);

    return pokerHand;
  }

  public static getRankFrequencies(cards: Card[]) {
    const rankFrequencies: number[] = Array(ALL_RANKS.length).fill(0);

    for (const { zeroIndexedRank } of cards) {
      rankFrequencies[zeroIndexedRank]++;
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
