import {Injectable} from '@angular/core';

import {Game, Mode} from '../models/game';
import {RenderInformation} from '../models/renderinformation';

import {CanvasPosition} from '../pages/game-board/game-board';

@Injectable()
export class GameStateService {
    
    private _currentGame: Game;

    constructor() {
    }
    
    startNewSinglePlayerGame() {
        this._currentGame = new Game(Mode.Single);
    }
    
    // no plan to implement multiplayer - just a stub realy
    startNewMultiPlayerGame() {
        this._currentGame = new Game(Mode.Multi);
    }
    
    isGameRunning() {
        return this._currentGame != null && !this._currentGame.isFinished;
    }
    
    renderBoards(renderInfo: RenderInformation) {
        if (this._currentGame) {
            this._currentGame.renderPlayerBoard(renderInfo);
        }
    }
    
    handleMovingGesture(position: CanvasPosition, event: any) {
        if (this._currentGame) {
            this._currentGame.handleMovingGesture(position, event);
        }
    }
} 