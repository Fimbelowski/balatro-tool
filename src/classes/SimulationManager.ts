import type GameActions from '../types/GameActions';
import type GameManager from './GameManager';
import type GameState from '../types/GameState';

export default class SimulationManager {
  private readonly _targetNumSimulations = 1;
  private _numLosses = 0;
  private _numSimulations = 0;
  private _numWins = 0;

  constructor(
    private readonly _gameManager: GameManager,
    private readonly _strategy: (
      gameState: GameState,
      gameActions: GameActions,
    ) => void,
    private readonly _goal: (gamestate: GameState) => boolean,
  ) {
    this.runSimulation();
  }

  private runSimulation() {
    this._gameManager.startRun();

    let gameState = this._gameManager.gameState;
    const gameActions = this._gameManager.gameActions;

    // A simulation is considered complete when the goal function returns true, or a game over is reached.
    while (!this._goal(gameState) && !gameState.isGameOver) {
      this._strategy(gameState, gameActions);
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
