import type Card from '../Card';
import createStandardPlayingCards from '../../utils/createStandardPlayingCards';

const DEFAULT_HAND_SIZE = 8;
const DEFAULT_NUM_DISCARDS = 2;
const DEFAULT_NUM_HANDS = 4;

interface Options {
  cardGenerator?: () => Card[];
  handsize?: number;
  numDiscards?: number;
  numHands?: number;
}

export default abstract class Deck {
  public readonly cards: Card[];
  public readonly handSize: number;
  public readonly numDiscards: number;
  public readonly numHands: number;

  constructor({ cardGenerator, handsize, numDiscards, numHands }: Options) {
    this.cards =
      cardGenerator === undefined
        ? createStandardPlayingCards()
        : cardGenerator();
    this.handSize = handsize ?? DEFAULT_HAND_SIZE;
    this.numDiscards = numDiscards ?? DEFAULT_NUM_DISCARDS;
    this.numHands = numHands ?? DEFAULT_NUM_HANDS;
  }
}
