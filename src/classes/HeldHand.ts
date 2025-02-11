import type Card from './Card';
import DrawPile from './DrawPile';
import nestedSort, { type ValuationFunction } from '../utils/nestedSort';
import Rank from '../types/Rank';
import Suit from '../types/Suit';

type HeldHandSortBehavior = 'rank' | 'suit';

export default class HeldHand {
  public readonly cards: Card[];
  private privateHeldHandSortBehavior: HeldHandSortBehavior = 'rank';

  constructor(
    private drawPile: DrawPile,
    private handSize: number,
  ) {
    this.cards = [];
    this.drawUntilHandIsFull();
  }

  containsFlush() {
    return this.containsAtLeastNOfAnySuit(5);
  }

  containsFullHouse() {
    const rankFrequenciesAsArray = Array.from(this.rankFrequencies.values());

    const threeOfAKindRankIndex = rankFrequenciesAsArray.findIndex(
      (value) => value >= 3,
    );

    if (threeOfAKindRankIndex === -1) {
      return false;
    }

    rankFrequenciesAsArray.splice(threeOfAKindRankIndex, 1);

    return rankFrequenciesAsArray.some((value) => value >= 2);
  }

  private containsAtLeastNOfAnyRank(n: number) {
    return Array.from(this.rankFrequencies.values()).some(
      (value) => value >= n,
    );
  }

  private containsAtLeastNOfAnySuit(n: number) {
    return Array.from(this.suitMap.values()).some((value) => value >= n);
  }

  containsPair() {
    return this.containsAtLeastNOfAnyRank(2);
  }

  containsStraight() {
    const RANK_ORDERING = [
      Rank.Ace,
      Rank.Two,
      Rank.Three,
      Rank.Four,
      Rank.Five,
      Rank.Six,
      Rank.Seven,
      Rank.Eight,
      Rank.Nine,
      Rank.Ten,
      Rank.Jack,
      Rank.Queen,
      Rank.King,
      Rank.Ace,
    ];

    const distinctRanksOrderIndices = Array.from(this.distinctRanks)
      .map((rank) => {
        const indices: number[] = [];

        RANK_ORDERING.forEach((orderedRank, index) => {
          if (rank === orderedRank) {
            indices.push(index);
          }
        });

        return indices;
      })
      .flat()
      .sort((a, b) => a - b);

    let currentStraightLength = 1;
    let left = 0;
    let right = 1;

    while (right < distinctRanksOrderIndices.length) {
      if (
        distinctRanksOrderIndices[right] - distinctRanksOrderIndices[left] <=
        1
      ) {
        currentStraightLength++;
        left++;
        right++;
      } else {
        currentStraightLength = 1;
        left++;
        right = left + 1;
      }

      if (currentStraightLength >= 5) {
        return true;
      }
    }

    return false;
  }

  containsThreeOfAKind() {
    return this.containsAtLeastNOfAnyRank(3);
  }

  containsTwoPair() {
    let numPairs = 0;

    for (const mapValue of this.rankFrequencies.values()) {
      if (mapValue >= 2) {
        numPairs++;
      }
    }

    return numPairs >= 2;
  }

  discard(cardIds: number[]) {
    cardIds.forEach((cardId) => {
      this.discardCard(cardId);
    });

    this.drawUntilHandIsFull();
  }

  private discardCard(cardId: number) {
    const index = this.cards.findIndex(({ id }) => id === cardId);

    if (index === undefined) {
      throw Error(`Card id ${cardId} not found.`);
    }

    this.cards.splice(index, 1);
  }

  private get distinctRanks() {
    const distinctRanks = new Set<Rank>();

    this.cards.forEach(({ rank }) => {
      distinctRanks.add(rank);
    });

    return distinctRanks;
  }

  private drawUntilHandIsFull() {
    while (this.cards.length < this.handSize) {
      const drawnCard = this.drawPile.drawCard();

      if (drawnCard === undefined) {
        break;
      }

      this.cards.push(drawnCard);
    }

    this.sort();
  }

  set heldHandSortBehavior(newHeldHandSortBehavior: HeldHandSortBehavior) {
    this.privateHeldHandSortBehavior = newHeldHandSortBehavior;
    this.sort();
  }

  private get rankFrequencies() {
    const rankFrequencies = new Map<Rank, number>();

    this.cards.forEach(({ rank }) => {
      if (rankFrequencies.get(rank) === undefined) {
        rankFrequencies.set(rank, 0);
      }

      const rankValue = rankFrequencies.get(rank) as number;
      rankFrequencies.set(rank, rankValue + 1);
    });

    return rankFrequencies;
  }

  public sort() {
    const rankValuationFunction: ValuationFunction<Card> = ({
      numericalRank,
    }: Card) => numericalRank;

    const suitValuationFunction: ValuationFunction<Card> = ({
      numericalSuit,
    }: Card) => numericalSuit;

    const valuationOrder =
      this.privateHeldHandSortBehavior === 'rank'
        ? [rankValuationFunction, suitValuationFunction]
        : [suitValuationFunction, rankValuationFunction];

    this.cards.splice(
      0,
      this.cards.length,
      ...nestedSort(this.cards, valuationOrder),
    );
  }

  get suitMap() {
    const rankMap = new Map<Suit, number>();

    this.cards.forEach(({ suit }) => {
      if (rankMap.get(suit) === undefined) {
        rankMap.set(suit, 0);
      }

      const rankValue = rankMap.get(suit) as number;
      rankMap.set(suit, rankValue + 1);
    });

    return rankMap;
  }

  public toString() {
    return this.cards.map((card) => card.toString()).join(' ');
  }
}
