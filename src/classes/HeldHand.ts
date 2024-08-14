import type Card from './Card';
import DrawPile from './DrawPile';
import nestedSort, { type ValuationFunction } from '../utils/nestedSort';
import Rank from '../types/Rank';

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

  containsPair() {
    // return this.rankMap.values()
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

  get rankMap() {
    const rankMap = new Map<Rank, number>();

    this.cards.forEach(({ rank }) => {
      if (rankMap.get(rank) === undefined) {
        rankMap.set(rank, 0);
      }

      const rankValue = rankMap.get(rank) as number;
      rankMap.set(rank, rankValue + 1);
    });

    return rankMap;
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

  public toString() {
    return this.cards.map((card) => card.toString()).join(' ');
  }
}
