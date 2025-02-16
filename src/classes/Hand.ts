import type Card from './Card';
import PokerHand from '../types/PokerHand';
import Rank, { RANK_INDEX_OFFSET } from '../types/Rank';

export default abstract class Hand {
  public static containsFiveOfAKind(cards: Card[]) {
    const rankFrequencies = Hand.getRankFrequencies(cards);

    return rankFrequencies.some((rankFrequency) => rankFrequency >= 5);
  }

  public static containsFlush(cards: Card[]) {
    const suitFrequencies = Hand.getSuitFrequencies(cards);

    return suitFrequencies.some((value) => value >= 5);
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

    return rankFrequencies.some((rankFrequency) => rankFrequency >= 4);
  }

  public static containsFullHouse(cards: Card[]) {
    const rankFrequencies = Hand.getRankFrequencies(cards);

    let containsThreeOfAKind = false;
    let containsPair = false;

    for (let i = 0; i < rankFrequencies.length; i++) {
      const rankFrequency = rankFrequencies[i];

      if (rankFrequency >= 3 && !containsThreeOfAKind) {
        containsThreeOfAKind = true;
        rankFrequencies.splice(i, 1);
        i = 0;
      } else if (rankFrequency >= 2) {
        containsPair = true;
      }
    }

    return containsThreeOfAKind && containsPair;
  }

  public static containsPair(cards: Card[]) {
    const rankFrequencies = Hand.getRankFrequencies(cards);

    return rankFrequencies.some((rankFrequency) => rankFrequency >= 2);
  }

  public static containsStraight(cards: Card[]) {
    const sortedDistinctRanks: Rank[] = cards
      .map(({ rank }) => rank)
      .filter((rank, index, self) => self.indexOf(rank) === index)
      .sort((a, b) => a - b);

    const containsAce = sortedDistinctRanks.includes(Rank.Ace);

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

    return cardsGroupedBySuit.some((group) => Hand.containsStraight(group));
  }

  public static containsThreeOfAKind(cards: Card[]) {
    const rankFrequencies = Hand.getRankFrequencies(cards);

    return rankFrequencies.some((rankFrequency) => rankFrequency >= 3);
  }

  public static containsTwoPair(cards: Card[]) {
    const rankFrequencies = Hand.getRankFrequencies(cards);

    let numPairs = 0;

    rankFrequencies.forEach((rankFrequency) => {
      if (rankFrequency >= 2) {
        numPairs++;
      }
    });

    return numPairs >= 2;
  }

  public static getHighestRankingPokerHand(cards: Card[]) {
    if (Hand.containsFlushFive(cards)) {
      return PokerHand.FlushFive;
    }

    if (Hand.containsFlushHouse(cards)) {
      return PokerHand.FlushHouse;
    }

    if (Hand.containsFiveOfAKind(cards)) {
      return PokerHand.FiveOfAKind;
    }

    if (Hand.containsStraightFlush(cards)) {
      return PokerHand.StraightFlush;
    }

    if (Hand.containsFourOfAKind(cards)) {
      return PokerHand.FourOfAKind;
    }

    if (Hand.containsFullHouse(cards)) {
      return PokerHand.FullHouse;
    }

    if (Hand.containsFlush(cards)) {
      return PokerHand.Flush;
    }

    if (Hand.containsStraight(cards)) {
      return PokerHand.Straight;
    }

    if (Hand.containsThreeOfAKind(cards)) {
      return PokerHand.ThreeOfAKind;
    }

    if (Hand.containsTwoPair(cards)) {
      return PokerHand.TwoPair;
    }

    if (Hand.containsPair(cards)) {
      return PokerHand.Pair;
    }

    return PokerHand.HighCard;
  }

  public static getRankFrequencies(cards: Card[]) {
    return cards.reduce((previousValue, { rank }) => {
      previousValue[rank - RANK_INDEX_OFFSET]++;
      return previousValue;
    }, Array(13).fill(0));
  }

  public static getSuitFrequencies(cards: Card[]) {
    return cards.reduce((previousValue, { suit }) => {
      previousValue[suit]++;
      return previousValue;
    }, Array(4).fill(0));
  }

  public static groupCardsBySuit(cards: Card[]) {
    return cards.reduce(
      (previousValue, card) => {
        const { suit } = card;
        previousValue[suit].push(card);
        return previousValue;
      },
      [[], [], [], []] as Array<Array<Card>>,
    );
  }
}
