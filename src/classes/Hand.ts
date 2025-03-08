import { ALL_SUITS } from '../types/Suit';
import type Card from './Card';
import PokerHand, { pokerHandToScoringInfo } from '../types/PokerHand';
import radixSort from '../utils/radixSort';
import Rank, { ALL_RANKS } from '../types/Rank';

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

  public static getHighCardScoringCard(cards: Card[]) {
    let highestRankingCard = cards[0];

    for (let i = 1; i < cards.length; i++) {
      const currentCard = cards[i];

      if (currentCard.zeroIndexedRank > highestRankingCard.zeroIndexedRank) {
        highestRankingCard = currentCard;
      }
    }

    return highestRankingCard;
  }

  public static getHighestRankingPokerHand(
    cards: Card[],
    omitSecretHandTypes = true,
  ) {
    const cardsAsNumbers = cards.map(
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
      if (Hand.containsFlushFive(cards)) {
        pokerHand = PokerHand.FlushFive;
      } else if (Hand.containsFlushHouse(cards)) {
        pokerHand = PokerHand.FlushHouse;
      } else if (Hand.containsFiveOfAKind(cards)) {
        pokerHand = PokerHand.FiveOfAKind;
      }
    }

    if (Hand.containsStraightFlush(cards)) {
      pokerHand = PokerHand.StraightFlush;
    } else if (Hand.containsFourOfAKind(cards)) {
      pokerHand = PokerHand.FourOfAKind;
    } else if (Hand.containsFullHouse(cards)) {
      pokerHand = PokerHand.FullHouse;
    } else if (Hand.containsFlush(cards)) {
      pokerHand = PokerHand.Flush;
    } else if (Hand.containsStraight(cards)) {
      pokerHand = PokerHand.Straight;
    } else if (Hand.containsThreeOfAKind(cards)) {
      pokerHand = PokerHand.ThreeOfAKind;
    } else if (Hand.containsTwoPair(cards)) {
      pokerHand = PokerHand.TwoPair;
    } else if (Hand.containsPair(cards)) {
      pokerHand = PokerHand.Pair;
    }

    sortedCardsToPokerHand.set(hash, pokerHand);

    return pokerHand;
  }

  public static getPairScoringCards(cards: Card[]) {
    const cardsGroupedByRank = Hand.groupCardsByRank(cards);

    let highestRankingPairZeroIndexedRank = -Infinity;

    for (let i = 0; i < cardsGroupedByRank.length; i++) {
      const group = cardsGroupedByRank[i];

      if (group.length === 2) {
        highestRankingPairZeroIndexedRank = i;
      }
    }

    return cardsGroupedByRank[highestRankingPairZeroIndexedRank];
  }

  public static getRankFrequencies(cards: Card[]) {
    const rankFrequencies: number[] = Array(ALL_RANKS.length).fill(0);

    for (const { zeroIndexedRank } of cards) {
      rankFrequencies[zeroIndexedRank]++;
    }

    return rankFrequencies;
  }

  public static getScoringCards(cards: Card[]) {
    const highestRankingPokerHand = Hand.getHighestRankingPokerHand(cards);

    switch (highestRankingPokerHand) {
      case PokerHand.FlushFive:
      case PokerHand.FlushHouse:
      case PokerHand.FiveOfAKind:
      case PokerHand.StraightFlush:
      case PokerHand.FourOfAKind:
      case PokerHand.FullHouse:
      case PokerHand.Flush:
      case PokerHand.Straight:
        return cards;
      case PokerHand.ThreeOfAKind:
        return Hand.getThreeOfAKindScoringCards(cards);
      case PokerHand.TwoPair:
        return Hand.getTwoPairScoringCards(cards);
      case PokerHand.Pair:
        return Hand.getPairScoringCards(cards);
      case PokerHand.HighCard:
        return [this.getHighCardScoringCard(cards)];
    }
  }

  public static getSuitFrequencies(cards: Card[]) {
    const suitFrequencies = Array(ALL_SUITS.length).fill(0);

    for (const { suit } of cards) {
      suitFrequencies[suit]++;
    }

    return suitFrequencies;
  }

  public static getThreeOfAKindScoringCards(cards: Card[]) {
    const cardsGroupedByRank = Hand.groupCardsByRank(cards);

    const scoringCards: Card[] = [];

    for (const group of cardsGroupedByRank) {
      if (group.length === 3) {
        scoringCards.push(...group);
      }
    }

    return scoringCards;
  }

  public static getTwoPairScoringCards(cards: Card[]) {
    const cardsGroupedByRank = Hand.groupCardsByRank(cards);

    const scoringCards: Card[] = [];

    for (let i = 0; i < cardsGroupedByRank.length; i++) {
      const group = cardsGroupedByRank[i];
      if (group.length === 2) {
        scoringCards.push(...group);
      }
    }

    return scoringCards;
  }

  public static groupCardsByRank(cards: Card[]) {
    const buckets: Card[][] = [];

    for (let i = 0; i < ALL_RANKS.length; i++) {
      buckets.push([]);
    }

    for (const card of cards) {
      buckets[card.zeroIndexedRank].push(card);
    }

    return buckets;
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

  public static scoreHand(cards: Card[]) {
    if (cards.length === 0) {
      throw Error('A played hand must contain at least 1 card.');
    }

    if (cards.length > 5) {
      throw Error('A played hand must contain no more than 5 cards.');
    }

    const highestRankingPokerHand = Hand.getHighestRankingPokerHand(cards);

    const scoringInfo = pokerHandToScoringInfo[highestRankingPokerHand];
    const { chips: baseChips, mult } = scoringInfo;

    const scoringCards = Hand.getScoringCards(cards);

    const totalChips = scoringCards.reduce(
      (previousTotalChips, { chipValue }) => previousTotalChips + chipValue,
      baseChips,
    );

    return totalChips * mult;
  }
}
