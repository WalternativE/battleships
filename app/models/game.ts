import {Board} from './board';
import {RenderInformation} from './renderinformation';


export class Game {
    
    private _isFinished;
    
    get isFinished() {
        return this._isFinished;
    }
    
    private _mode: Mode;

    private _playerOneBoard: Board;
    private _playerTwoBoard: Board;

    constructor(mode: Mode) {
        this._mode = mode;
        
        this._isFinished = false;
        
        this._playerOneBoard = new Board();
        this._playerTwoBoard = new Board();
    }
    
    renderPlayerBoard(renderInfo: RenderInformation) {
        this._playerOneBoard.renderShips(renderInfo);
    }
}

export enum Mode {
    Single,
    Multi
}