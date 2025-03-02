import GameManager from './GameManager';
import type GameState from '../types/GameState';
import type { Strategy } from '../types/Strategy';
import type Deck from './decks/Deck';

export default class SimulationManager {
  private _gameManager: GameManager;
  private _numLosses = 0;
  private _numSimulations = 0;
  private _numWins = 0;
  private readonly _targetNumSimulations = 100_000;

  constructor(
    deck: Deck,
    private readonly _strategy: Strategy,
    private readonly _goal: (gamestate: GameState) => boolean,
  ) {
    this._gameManager = new GameManager(deck);
    this.runAllSimulations();
  }

  private runAllSimulations() {
    while (this._numSimulations < this._targetNumSimulations) {
      this.runSimulation();
    }

    console.log('Total simulations:', this._numSimulations);
    console.log('Total wins:', this._numWins);
    console.log('Total losses:', this._numLosses);
  }

  private runSimulation() {
    this._gameManager.startRun();

    let gameState = this._gameManager.gameState;
    const gameActions = this._gameManager.gameActions;

    // A simulation is considered complete when the goal function returns true, or a game over is reached.
    while (!this._goal(gameState) && !gameState.isGameOver) {
      const [gameAction, cards] = this._strategy(gameState, gameActions);

      if (gameAction === 'discardHand') {
        gameActions.discardHand(cards);
      } else {
        gameActions.playHand(cards);
      }

      gameState = this._gameManager.gameState;
    }

    // Check if goal is met, or game over and record result, otherwise rerun this loop.
    if (this._goal(gameState)) {
      this._numWins++;
    } else if (gameState.isGameOver) {
      this._numLosses++;
    }

    this._numSimulations++;
  }
}
