import {Page, Toast} from 'ionic-angular';

import {ViewChild, Inject} from '@angular/core';

import {GameStateService} from '../../services/game-state-service';

import {RenderInformation} from '../../models/renderinformation';

import {BoardUtil, CanvasDimensions} from '../../util/board-util';


@Page({
    templateUrl: 'build/pages/attack-board/attack-board.html'
})
export class AttackBoard {

    private _columnCount;
    private _rowCount;

    @ViewChild('attackcanvas') attackCanvas: any;

    private _ctx: CanvasRenderingContext2D;
    private _dimensions: CanvasDimensions;
    
    private _animationId: number;
    private _shouldAnimationStop: boolean;

    constructor(private _gameStateService: GameStateService) {
        this._columnCount = 10;
        this._rowCount = 10;
    }
    
    onPageWillEnter() {
        let canvas: HTMLCanvasElement = this.attackCanvas.nativeElement;
        this._dimensions = BoardUtil.computeCanvasDimensions();
        
    }
    
    onPageDidLeave() {
        
    }

    handleCanvasClick(event: MouseEvent) {

    }

    backToGameBoard() {

    }
}