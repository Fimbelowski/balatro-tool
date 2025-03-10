import Card from './Card';
import type CardOrCards from '../types/CardOrCards';
import Deck from './decks/Deck';
import DrawPile from './DrawPile';
import GameActions from '../types/GameActions';
import type GameState from '../types/GameState';
import Hand from './Hand';

export default class GameManager {
  private _chipRequirement = 300;
  private _currentChips = 0;
  private _drawPile = new DrawPile([]);
  private _heldHand: Card[] = [];
  private _numRemainingDiscards = 0;
  private _numRemainingHands = 0;
  private _round = 0;

  constructor(private readonly _deck: Deck) {}

  public get gameActions(): GameActions {
    return {
      discardHand: this._discardHand.bind(this),
      playHand: this._playHand.bind(this),
    };
  }

  public get gameState(): GameState {
    return {
      cardsRemainingInDrawPile: this._drawPile.remainingCards,
      chipRequirement: this._chipRequirement,
      chips: this._currentChips,
      heldHand: [...this._heldHand],
      isGameOver: this.isGameOver,
      numRemainingDiscards: this._numRemainingDiscards,
      numRemainingHands: this._numRemainingHands,
      round: this._round,
    };
  }

  private _cardOrCardsToIds(cardOrCards: CardOrCards) {
    const normalizedCards = Array.isArray(cardOrCards)
      ? cardOrCards
      : [cardOrCards];
    return normalizedCards.map(({ id }) => id);
  }

  private get isGameOver() {
    return (
      this._numRemainingHands === 0 &&
      this._currentChips < this._chipRequirement
    );
  }

  private _discardHand(cardOrCards: CardOrCards) {
    const normalizedCards = [cardOrCards].flat();

    if (normalizedCards.length === 0) {
      throw Error(
        `Must discard at least 1 card. ${normalizedCards.toString()}`,
      );
    } else if (normalizedCards.length > 5) {
      throw Error('Cannot discard more than 5 cards.');
    }

    const cardIds = this._cardOrCardsToIds(cardOrCards);

    this._removeCardsFromHeldHand(cardIds);
    this._drawUntilHeldHandIsFull();
    this._numRemainingDiscards--;
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

    this._round = 1;
  }

  private _playHand(cardOrCards: CardOrCards) {
    const cardIds = this._cardOrCardsToIds(cardOrCards);

    const playedCards = this._removeCardsFromHeldHand(cardIds);

    this._currentChips += Hand.scoreHand(playedCards);
    this._numRemainingHands -= 1;

    if (this._currentChips >= this._chipRequirement) {
      this._round++;
      this._currentChips = 0;
    }

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
