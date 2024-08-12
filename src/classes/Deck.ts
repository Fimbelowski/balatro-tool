import type Card from './Card';
import DrawPile from './DrawPile';
import getRandomIntegerInclusive from '../utils/getRandomIntegerInclusive';
import createStandardPlayingCards from '../utils/createStandardPlayingCards';

const DEFAULT_HAND_SIZE = 8;
const DEFAULT_NUM_DISCARDS = 2;
const DEFAULT_NUM_HANDS = 4;

interface Options {
  cards?: Card[];
  handsize?: number;
  numDiscards?: number;
  numHands?: number;
}

export default class Deck {
  protected cards: Card[];
  public handSize: number;
  public numDiscards: number;
  public numHands: number;

  constructor({ cards, handsize, numDiscards, numHands }: Options) {
    this.cards = cards ?? createStandardPlayingCards();
    this.handSize = handsize ?? DEFAULT_HAND_SIZE;
    this.numDiscards = numDiscards ?? DEFAULT_NUM_DISCARDS;
    this.numHands = numHands ?? DEFAULT_NUM_HANDS;
  }

  public shuffle() {
    const shuffledCards: Card[] = [...this.cards];

    for (let i = shuffledCards.length - 1; i >= 1; i--) {
      const j = getRandomIntegerInclusive(0, i);
      const temp = shuffledCards[i];
      shuffledCards.splice(i, 1, shuffledCards[j]);
      shuffledCards.splice(j, 1, temp);
    }

    return new DrawPile(shuffledCards);
  }
}
