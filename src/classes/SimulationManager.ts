import GameManager from './GameManager';
import type GameState from '../types/GameState';
import type { Strategy } from '../types/Strategy';
import type Deck from './decks/Deck';

export default class SimulationManager {
  private _gameManager: GameManager;
  private _numHandsDiscarded = 0;
  private _numHandsDiscardedPerWin = 0;
  private _numHandsPlayedPerWin = 0;
  private _numLosses = 0;
  private _numSimulations = 0;
  private _numWins = 0;
  private readonly _targetNumSimulations = 100_000;

  constructor(
    private readonly _deck: Deck,
    private readonly _strategy: Strategy,
    private readonly _goal: (gamestate: GameState) => boolean,
  ) {
    this._gameManager = new GameManager(this._deck);
    this.runAllSimulations();
  }

  private runAllSimulations() {
    const start = window.performance.now();

    while (this._numSimulations < this._targetNumSimulations) {
      this.runSimulation();
    }

    const end = window.performance.now();
    const time = end - start;
    console.log(`Total runtime: ${time}ms`);

    console.log('Total simulations:', this._numSimulations.toLocaleString());
    console.log('Total wins:', this._numWins.toLocaleString());
    console.log('Total losses:', this._numLosses.toLocaleString());

    console.log(
      'Avg Hands Played Per Win:',
      this._numHandsPlayedPerWin / this._numWins,
    );

    console.log(
      'Avg Discards Used Per Win:',
      this._numHandsDiscardedPerWin / this._numWins,
    );
  }

  private runSimulation() {
    this._gameManager.startRun();

    let gameState = this._gameManager.gameState;
    const gameActions = this._gameManager.gameActions;

    // A simulation is considered complete when the goal function returns true, or a game over is reached.
    while (!this._goal(gameState) && !gameState.isGameOver) {
      const [gameAction, cards] = this._strategy(gameState);

      if (gameAction === 'discardHand') {
        gameActions.discardHand(cards);
        this._numHandsDiscarded++;
      } else {
        gameActions.playHand(cards);
      }

      gameState = this._gameManager.gameState;
    }

    // Check if goal is met, or game over and record result, otherwise rerun this loop.
    if (this._goal(gameState)) {
      this._numWins++;

      this._numHandsPlayedPerWin +=
        this._deck.numHands - gameState.numRemainingHands;

      this._numHandsDiscardedPerWin +=
        this._deck.numDiscards - gameState.numRemainingDiscards;
    } else if (gameState.isGameOver) {
      this._numLosses++;
    }

    this._numSimulations++;
  }
}
