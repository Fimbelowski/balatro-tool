import Card from './Card';
import Deck from './decks/Deck';
import DrawPile from './DrawPile';
import type GameState from '../types/GameState';
import PlayedHand from './PlayedHand';
import PokerHand, { pokerHandToScoringInfo } from '../types/PokerHand';
import GameInterface from '../types/GameInterface';

export default class GameManager {
  private _chipRequirement = 300;
  private _currentChips = 0;
  private _drawPile = new DrawPile([]);
  private _heldHand: Card[] = [];
  private _numRemainingDiscards = 0;
  private _numRemainingHands = 0;
  private _round = 0;

  constructor(private readonly _deck: Deck) {}

  public get gameInterface(): GameInterface {
    return {
      ...this.gameState,
      discardHand: this._discardHand,
      playHand: this._playHand,
    };
  }

  public get gameState(): GameState {
    return {
      chipRequirement: this._chipRequirement,
      chips: this._currentChips,
      heldHand: this._heldHand,
      isGameOver: this.isGameOver,
      numRemainingDiscards: this._numRemainingDiscards,
      numRemainingHands: this._numRemainingHands,
      round: this._round,
    };
  }

  private get isGameOver() {
    return (
      this._numRemainingHands === 0 &&
      this._currentChips < this._chipRequirement
    );
  }

  private _discardHand(cardIds: number[]) {
    this._removeCardsFromHeldHand(cardIds);
    this._drawUntilHeldHandIsFull();
  }

  private _drawUntilHeldHandIsFull() {
    const numCardsToDraw = this._deck.handSize - this._heldHand.length;
    this._heldHand.push(...this._drawPile.drawCards(numCardsToDraw));
  }

  public startRun() {
    const { cards, handSize, numDiscards, numHands } = this._deck;

    this._drawPile = new DrawPile(cards);
    this._heldHand = this._drawPile.drawCards(handSize);
    this._numRemainingDiscards = numDiscards;
    this._numRemainingHands = numHands;
  }

  private _playHand(cardIds: number[]) {
    const playedCards = this._removeCardsFromHeldHand(cardIds);
    const playedHand = new PlayedHand(playedCards);

    const highestRankingPokerHand = playedHand.getHighestRankingPokerHand();
    const scoringInfo = pokerHandToScoringInfo.get(highestRankingPokerHand);

    playedHand.getScoringCards();

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

    this._drawUntilHeldHandIsFull();
  }

  private _removeCardsFromHeldHand(cardIds: number[]) {
    const cardsToRemove: Card[] = [];

    cardIds.forEach((cardId) => {
      const cardIndex = this._heldHand.findIndex(({ id }) => cardId === id);

      if (cardIndex === -1) {
        throw Error(`Could not find card with id of ${cardId}`);
      }

      cardsToRemove.push(this._heldHand[cardIndex]);
      this._heldHand.splice(cardIndex, 1);
    });

    return cardsToRemove;
  }
}
