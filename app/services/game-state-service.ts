import {Injectable} from '@angular/core';

import {Game, Mode} from '../models/game';
import {RenderInformation} from '../models/renderinformation';

import {CanvasPosition} from '../util/board-util';

@Injectable()
export class GameStateService {
    
    private _currentGame: Game;
    
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
    
    renderVisiblePlayerBoard(renderInfo: RenderInformation) {
        if (this._currentGame) {
            this._currentGame.renderPlayerBoard(renderInfo);
        }
    }
    
    renderAttackBoard(renderInfo: RenderInformation) {
        if (this._currentGame) {
            this._currentGame.renderAttackBoard(renderInfo);
        }
    }
    
    handleMovingGesture(position: CanvasPosition, event: any) {
        if (this._currentGame) {
            this._currentGame.handleMovingGesture(position, event);
        }
    }
    
    isStillAdjusting(): boolean {
        if (this._currentGame) {
            return this._currentGame.isStillAdjusting();
        } else {
            return true;
        }
    }
    
    startBattlePhase() {
        if (this._currentGame) {
            this._currentGame.startBattlePhase();
        }
    }
}