import {Board} from './board';
import {RenderInformation} from './renderinformation';

import {CanvasPosition} from '../util/board-util';

export class Game {

    private _isFinished;

    get isFinished() {
        return this._isFinished;
    }

    private _mode: Mode;
    private _phase: Phase;

    private _playerOneBoard: Board;
    private _playerTwoBoard: Board;

    constructor(mode: Mode) {
        this._phase = Phase.Adjustment;
        this._mode = mode;

        this._isFinished = false;

        this._playerOneBoard = new Board();
        this._playerTwoBoard = new Board();
    }

    renderPlayerBoard(renderInfo: RenderInformation) {
        this._playerOneBoard.renderShips(renderInfo);
    }
    
    renderAttackBoard(renderInfo: RenderInformation) {
        this._playerTwoBoard.renderAttackMarks(renderInfo);
    }

    handleMovingGesture(position: CanvasPosition, event: any) {
        if (this.isStillAdjusting()) {
            this._playerOneBoard.handleMovingGesture(position, event);
        }
    }

    startBattlePhase() {
        this._phase = Phase.Battle;
        
        this._playerOneBoard.updateHitMapWithShipPositions();
        this._playerTwoBoard.updateHitMapWithShipPositions();
        
        console.log('Battle Phase started');
    }

    isStillAdjusting(): boolean {
        return this._phase == Phase.Adjustment;
    }
}

export enum Mode {
    Single,
    Multi
}

enum Phase {
    Adjustment,
    Battle
}