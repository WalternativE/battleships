import {Page, Toast, MenuController, Nav} from 'ionic-angular';

import {ViewChild, Inject} from '@angular/core';

import {GameStateService} from '../../services/game-state-service';

import {RenderInformation} from '../../models/renderinformation';

import {BoardUtil, CanvasDimensions} from '../../util/board-util';

import {GameBoard} from '../game-board/game-board';


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

    constructor(private _gameStateService: GameStateService,
        private _menu: MenuController,
        private _nav: Nav) {
        this._columnCount = 10;
        this._rowCount = 10;

        _menu.swipeEnable(false);
    }

    onPageWillEnter() {
        let canvas: HTMLCanvasElement = this.attackCanvas.nativeElement;
        this._ctx = canvas.getContext('2d');
        
        this._dimensions = BoardUtil.computeCanvasDimensions();

        canvas.width = this._dimensions.width;
        canvas.height = this._dimensions.height;

        this._shouldAnimationStop = false;
        this.startWindowAnimation();
    }

    onPageDidLeave() {
        this._shouldAnimationStop = true;
        this.stopWindowAnimation();
    }

    startWindowAnimation() {
        window.requestAnimationFrame(id => this.renderBoard(id));
    }

    stopWindowAnimation() {
        window.cancelAnimationFrame(this._animationId);
    }
    
    renderBoard(id: number) {
        this._animationId = id;

        this._ctx.clearRect(0, 0, this._dimensions.width, this._dimensions.height);
        BoardUtil.renderFieldLines(this._dimensions, this._ctx,
            this._rowCount, this._columnCount);
            
        this._gameStateService.renderAttackBoard({
            context: this._ctx,
            height: this._dimensions.height,
            width: this._dimensions.width
        });

        if (this._shouldAnimationStop) {
            this.stopWindowAnimation();
        } else {
            this.startWindowAnimation();
        }
    }

    handleCanvasClick(event: MouseEvent) {
        
    }

    backToGameBoard() {
        this._nav.pop();
    }
}