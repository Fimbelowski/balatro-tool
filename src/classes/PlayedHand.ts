import type Card from './Card';
import Hand from './Hand';
import PokerHand from '../types/PokerHand';
import type Rank from '../types/Rank';

export default class PlayedHand extends Hand {
  constructor(public readonly cards: Card[]) {
    if (cards.length === 0) {
      throw Error('A played hand must contain at least 1 card.');
    }

    if (cards.length > 5) {
      throw Error('A played hand must contain no more than 5 cards.');
    }

    super();
  }

  public getScoringCards() {
    const highestRankingPokerHand = Hand.getHighestRankingPokerHand(this.cards);

    switch (highestRankingPokerHand) {
      case PokerHand.FlushFive:
      case PokerHand.FlushHouse:
      case PokerHand.FiveOfAKind:
      case PokerHand.StraightFlush:
      case PokerHand.FourOfAKind:
      case PokerHand.FullHouse:
      case PokerHand.Flush:
      case PokerHand.Straight:
        return this.cards;
      case PokerHand.ThreeOfAKind:
        return this.getThreeOfAKindScoringCards();
      case PokerHand.TwoPair:
        return this.getTwoPairScoringCards();
      case PokerHand.Pair:
        return this.getPairScoringCards();
      case PokerHand.HighCard:
        return [this.getHighCardScoringCard()];
    }
  }

  private getHighCardScoringCard() {
    return this.cards.reduce((highestRankingCard, currentCard) =>
      highestRankingCard.rank > currentCard.rank
        ? highestRankingCard
        : currentCard,
    );
  }

  private getPairScoringCards() {
    const rankToFrequencyMap = this.getRankToFrequencyMap();
    const pairEntry = Array.from(rankToFrequencyMap.entries()).find(
      ([_rank, frequency]) => frequency >= 2,
    );

    if (pairEntry === undefined) {
      throw Error('Could not find rank with frequency >= 2.');
    }

    const [pairRank] = pairEntry;

    return this.cards.filter(({ rank }) => pairRank === rank);
  }

  private getRankToFrequencyMap() {
    const rankToFrequencyMap = new Map<Rank, number>();

    this.cards.forEach(({ rank }) => {
      if (!rankToFrequencyMap.has(rank)) {
        rankToFrequencyMap.set(rank, 0);
      }

      const frequency = rankToFrequencyMap.get(rank);

      if (frequency === undefined) {
        throw Error('Rank not found.');
      }

      rankToFrequencyMap.set(rank, frequency + 1);
    });

    return rankToFrequencyMap;
  }

  private getThreeOfAKindScoringCards() {
    const rankToFrequencyMap = this.getRankToFrequencyMap();
    const threeOfAKindEntry = Array.from(rankToFrequencyMap.entries()).find(
      ([_rank, frequency]) => frequency >= 3,
    );

    if (threeOfAKindEntry === undefined) {
      throw Error('Could not find rank with frequency >= 3.');
    }

    const [threeOfAKindRank] = threeOfAKindEntry;

    return this.cards.filter(({ rank }) => threeOfAKindRank === rank);
  }

  private getTwoPairScoringCards() {
    const rankToFrequencyMap = this.getRankToFrequencyMap();
    const pairEntries = Array.from(rankToFrequencyMap.entries()).filter(
      ([_rank, frequency]) => frequency >= 2,
    );

    const pairRanks = pairEntries
      .filter(([_rank, frequency]) => frequency >= 2)
      .map(([rank]) => rank);

    return this.cards.filter(({ rank }) => pairRanks.includes(rank));
  }
}
