import type GameInterface from '../types/GameInterface';
import type GameManager from './GameManager';
import type GameState from '../types/GameState';

export default class SimulatonManager {
  private readonly _targetNumSimulations = 1;
  private _numLosses = 0;
  private _numSimulations = 0;
  private _numWins = 0;

  constructor(
    private readonly _gameManager: GameManager,
    private readonly _strategy: (GameInterface: GameInterface) => void,
    private readonly _goal: (gamestate: GameState) => boolean,
  ) {
    this.runSimulation();
  }

  private runSimulation() {
    this._gameManager.startRun();

    let gameInterface = this._gameManager.gameInterface;
    let gameState = this._gameManager.gameState;

    // A simulation is considered complete when the goal function returns true, or a game over is reached.
    while (!this._goal(gameState) && !gameState.isGameOver) {
      this._strategy(gameInterface);
      gameInterface = this._gameManager.gameInterface;
      gameState = this._gameManager.gameState;
    }

    // Check if goal is met, or game over and record result, otherwise rerun this loop.
    if (this._goal(gameState)) {
      console.log('Goal reached!');
      this._numWins++;
    } else if (gameState.isGameOver) {
      console.log('Game over! :(');
      this._numLosses++;
    }

    this._numSimulations++;
  }
}
