import {Page, Toast} from 'ionic-angular';

import {ViewChild, Inject} from '@angular/core';

import {GameStateService} from '../../services/game-state-service';

import {RenderInformation} from '../../models/renderinformation';

import {BoardUtil, CanvasDimensions} from '../../util/board-util';

declare var interact: any;


@Page({
    templateUrl: 'build/pages/game-board/game-board.html'
})
export class GameBoard {

    private _columnCount;
    private _rowCount;

    @ViewChild('gamecanvas') gameCanvas: any;

    private _ctx: CanvasRenderingContext2D;
    private _dimensions: CanvasDimensions;

    private _animationId: number;
    private _shouldAnimationStop: boolean;

    constructor(private _gameStateService: GameStateService) {
        this._columnCount = 10;
        this._rowCount = 10;
    }

    onPageWillEnter() {
        let canvas: HTMLCanvasElement = this.gameCanvas.nativeElement;
        this._dimensions = BoardUtil.computeCanvasDimensions();

        canvas.width = this._dimensions.width;
        canvas.height = this._dimensions.height;

        this._ctx = canvas.getContext('2d');

        this.configureInteract(canvas);

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

    renderBoard(id) {
        this._animationId = id;

        this._ctx.clearRect(0, 0, this._dimensions.width, this._dimensions.height);
        BoardUtil.renderFieldLines(this._dimensions, this._ctx,
            this._rowCount, this._columnCount);
        this._gameStateService.renderBoards({
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

    configureInteract(canvas: HTMLCanvasElement) {
        let dimensions = BoardUtil.computeCanvasDimensions();
        dimensions.width = (dimensions.width / this._columnCount);
        dimensions.height = (dimensions.height / this._rowCount);

        interact(canvas)
            .snap({
                mode: 'grid',
                grid: {
                    x: dimensions.width,
                    y: dimensions.height,
                    offset: {
                        x: Math.floor(dimensions.width / 2),
                        y: Math.floor(dimensions.height / 2)
                    }
                }
            })
            .draggable({
                max: Infinity,
                maxPerElement: Infinity,
                restrict: {
                    restriction: 'self'
                }
            })
            .on('dragmove', (event) => {
                this.handleDragMove(dimensions, event);
            });
    }

    handleDragMove(dimensions: CanvasDimensions, event) {
        console.log(event);

        let context = this._ctx;
        // calculate the angle of the drag direction
        let dragAngle = 180 * Math.atan2(event.dx, event.dy) / Math.PI;

        // set color based on drag angle and speed
        context.fillStyle = 'hsl(' + dragAngle + ', 86%, '
            + (30 + Math.min(event.speed / 1000, 1) * 50) + '%)';

        let position = BoardUtil.getPositionOnCanvas(event, this.gameCanvas);

        this._gameStateService.handleMovingGesture(position, event);
    }

    isStillAdjusting(): boolean {
        return this._gameStateService.isStillAdjusting()
    }

    startBattlePhase() {
        this._gameStateService.startBattlePhase();
    }

    goToAttackBoard() {

    }
}