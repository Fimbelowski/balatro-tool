import type GameActions from './GameActions';
import type GameState from './GameState';

export default interface GameInterface extends GameActions, GameState {}
