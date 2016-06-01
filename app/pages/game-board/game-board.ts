import {Page, Toast} from 'ionic-angular';

import {ViewChild, Inject} from '@angular/core';

import {GameStateService} from '../../services/game-state-service';

import {RenderInformation} from '../../models/renderinformation';

declare var interact: any;

@Page({
    templateUrl: 'build/pages/game-board/game-board.html'
})
export class GameBoard {

    private _columnCount;
    private _rowCount;

    private _lastColumnXVal;

    @ViewChild('gamecanvas') gameCanvas: any;

    private _ctx: CanvasRenderingContext2D;
    private _dimensions;
    
    private _animationId: number;
    private _shouldAnimationStop: boolean;

    constructor(private _gameStateService: GameStateService) {
        this._columnCount = 10;
        this._rowCount = 10;
    }

    onPageWillEnter() {
        let canvas: HTMLCanvasElement = this.gameCanvas.nativeElement;
        this._dimensions = this.computeCanvasDimensions();

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
        this.renderFieldLines();
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
        let dimensions  = this.computeCanvasDimensions();
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

    computeCanvasDimensions(): CanvasDimensions {
        return {
            'width': window.innerWidth,
            'height': window.innerHeight - 200
        }
    }

    renderFieldLines() {
        this.renderColumns();
        this.renderRows();
    }

    renderColumns() {
        let columnDistance = this._dimensions.width / this._columnCount;

        for (let i = 0; i <= this._dimensions.width ; i += columnDistance) {
            this._ctx.beginPath();
            this._ctx.moveTo(i, 0);
            this._ctx.lineTo(i, this._dimensions.height);
            this._ctx.stroke();
            this._ctx.closePath();

            this._lastColumnXVal = i;
        }
    }

    renderRows() {
        let rowDistance = this._dimensions.height / this._rowCount;

        for (let i = 0; i <= this._dimensions.height; i += rowDistance) {
            this._ctx.beginPath();
            this._ctx.moveTo(0, i);
            this._ctx.lineTo(this._lastColumnXVal, i);
            this._ctx.stroke();
            this._ctx.closePath();
        }
    }

    handleDragMove(dimensions: CanvasDimensions, event) {        
        let context = this._ctx;
        // calculate the angle of the drag direction
        let dragAngle = 180 * Math.atan2(event.dx, event.dy) / Math.PI;

        // set color based on drag angle and speed
        context.fillStyle = 'hsl(' + dragAngle + ', 86%, '
            + (30 + Math.min(event.speed / 1000, 1) * 50) + '%)';

        let position = this.getPositionOnCanvas(event);
        // draw squares
        context.fillRect(position.x - dimensions.width / 2, position.y - dimensions.height / 2,
            dimensions.width, dimensions.height);
    }

    // for infos of this function there is a link to that
    // http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/   
    getPositionOnCanvas(evt: MouseEvent): CanvasPosition {
        let canvas: HTMLCanvasElement = this.gameCanvas.nativeElement;
        let rect = canvas.getBoundingClientRect();

        return {
            x: Math.round(
                (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width),
            y: Math.round(
                (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height)
        };
    }
}

interface CanvasDimensions {
    width: number;
    height: number;
}

interface CanvasPosition {
    x: number,
    y: number
}