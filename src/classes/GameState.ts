import Card from './Card';
import Deck from './decks/Deck';
import DrawPile from './DrawPile';
import Hand from './Hand';
import PlayedHand from './PlayedHand';
import PokerHand, { pokerHandToScoringInfo } from '../types/PokerHand';
import RedDeck from './decks/RedDeck';

export default class GameState {
  private _chipRequirement = 300;
  private _currentChips = 0;
  private _currentDeck: Deck = new RedDeck();
  private drawPile = new DrawPile([]);
  private _heldHand: Card[] = [];
  private _numRemainingDiscards = 0;
  private _numRemainingHands = 0;

  constructor() {}

  public get chipRequirement() {
    return this._chipRequirement;
  }

  public get currentChips() {
    return this._currentChips;
  }

  public get hand() {
    return [...this._heldHand];
  }

  public get numRemainingDiscards() {
    return this._numRemainingDiscards;
  }

  public get numRemainingHands() {
    return this._numRemainingHands;
  }

  public startRun(deck: Deck) {
    this._currentDeck = deck;

    const { cards, handSize, numDiscards, numHands } = this._currentDeck;

    this.drawPile = new DrawPile(cards);
    this._heldHand = this.drawPile.drawCards(handSize);
    this._numRemainingDiscards = numDiscards;
    this._numRemainingHands = numHands;
  }

  public playHand(cards: Card[]) {
    if (this._numRemainingHands === 0) {
      throw Error('No hands remaining.');
    }

    const playedHand = new PlayedHand(cards);
    playedHand.getScoringCards();

    const highestRankingPokerHand = Hand.getHighestRankingPokerHand(cards);
    const scoringInfo = pokerHandToScoringInfo.get(highestRankingPokerHand);

    if (scoringInfo === undefined) {
      throw Error(
        `Could not find scoring info for poker hand "${PokerHand[highestRankingPokerHand]}"`,
      );
    }

    const { chips: baseChips, mult } = scoringInfo;

    const scoringCards = playedHand.getScoringCards();

    const totalChips = scoringCards.reduce(
      (previousTotalChips, { chipValue }) => previousTotalChips + chipValue,
      baseChips,
    );

    this._currentChips += totalChips * mult;
    this._numRemainingHands -= 1;

    console.log('Chip requirement:', this._chipRequirement);
    console.log('Current total chips:', this._currentChips);

    // Check to see if the round is over
    if (this._currentChips >= this._chipRequirement) {
      console.log('Round won!');
    } else if (this._numRemainingDiscards > 0) {
      console.log('Continue playing...');
    } else {
      console.log('You lose!');
    }
  }
}
