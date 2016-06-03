import {Ship, ShipClass, HeadPosition, ShipOrientation} from './ship';
import {RenderInformation} from './renderinformation';

import {CanvasPosition} from '../util/board-util';

export class Board {

    private _shipsPerPlayer: Array<ShipConfiguration> = [
        { clazz: ShipClass.Battleship, piecesOnBoard: 1 },
        { clazz: ShipClass.Carrier, piecesOnBoard: 1 },
        { clazz: ShipClass.Cruiser, piecesOnBoard: 1 },
        { clazz: ShipClass.Destroyer, piecesOnBoard: 2 },
        { clazz: ShipClass.Submarine, piecesOnBoard: 2 }
    ]

    private _cells: Array<Array<HitMapFieldStates>>;
    private _ships: Array<Ship>;

    private _playerBoardRenderInfo: RenderInformation;

    constructor(private _columnCount = 10, private _rowCount = 10) {
        this.primeBoardCells();
        this.primeShipsOnBoard();
    }

    primeBoardCells() {
        this._cells = new Array<Array<number>>();

        for (let i = 0; i < this._columnCount; i++) {
            this._cells.push(new Array());

            for (let j = 0; j < this._rowCount; j++) {
                this._cells[i].push(HitMapFieldStates.None);
            }
        }
    }

    primeShipsOnBoard() {
        this._ships = new Array<Ship>();

        let row = 0;
        this._shipsPerPlayer.forEach((val) => {
            for (let i = 0; i < val.piecesOnBoard; i++) {
                this._ships.push(new Ship(val.clazz, {
                    row: row,
                    col: 0
                }));
                row++;
            }
        });
    }

    renderShips(renderInfo: RenderInformation) {
        // need this for other computation - I just assume that the renderInfo wills stay
        // as it is...doesn't factor in resize or portrait/landscape switches
        // if this becomes a requirment the way of optaining the dimensions has to be changed
        if (!this._playerBoardRenderInfo) {
            this._playerBoardRenderInfo = renderInfo;
        }

        let xFieldDistance = renderInfo.width / 10;
        let yFieldDistance = renderInfo.height / 10;

        this._ships.forEach(ship => {
            let xDrawPos = ship.headPosition.col * xFieldDistance;
            let yDrawPos = ship.headPosition.row * yFieldDistance;

            let drawWidth = 0;
            let drawHeight = 0;

            if (ship.orientation == ShipOrientation.Horizontal) {
                drawWidth = ship.size * xFieldDistance;
                drawHeight = 1 * yFieldDistance;
            } else {
                drawWidth = 1 * xFieldDistance;
                drawHeight = ship.size * yFieldDistance;
            }

            renderInfo.context.fillRect(xDrawPos, yDrawPos, drawWidth, drawHeight);
        });
    }

    renderAttackMarks(renderInfo: RenderInformation) {
        // same problem as in renderShips - Portrait Mode it is!
        let xFieldDistance = renderInfo.width / 10;
        let yFieldDistance = renderInfo.height / 10;

        this._cells.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell === HitMapFieldStates.Miss) {
                    let xAndYPos = this.computeXAndYPos(colIndex, rowIndex,
                        xFieldDistance, yFieldDistance);

                    this.drawMiss(renderInfo, xAndYPos, xFieldDistance, yFieldDistance);
                } else if (cell === HitMapFieldStates.Hit) {                    
                    let xAndYPos = this.computeXAndYPos(colIndex, rowIndex,
                        xFieldDistance, yFieldDistance);

                    this.drawHit(renderInfo, xAndYPos, xFieldDistance, yFieldDistance);
                }
            });
        });
    }

    drawMiss(renderInfo: RenderInformation,
        xAndYPos: XAndYPos, xFieldDistance: number, yFieldDistance: number) {
        this.drawAttackMark('blue', renderInfo, xAndYPos, xFieldDistance, yFieldDistance);
    }

    drawHit(renderInfo: RenderInformation,
        xAndYPos: XAndYPos, xFieldDistance: number, yFieldDistance: number) {
        this.drawAttackMark('red', renderInfo, xAndYPos, xFieldDistance, yFieldDistance);
    }

    drawAttackMark(fillStyle: string, renderInfo: RenderInformation,
        xAndYPos: XAndYPos, xFieldDistance: number, yFieldDistance: number) {
        renderInfo.context.fillStyle = fillStyle;
        renderInfo.context.fillRect(xAndYPos.xPos, xAndYPos.yPos,
            xFieldDistance, yFieldDistance);
    }

    computeXAndYPos(colIndex: number, rowIndex: number,
        xFieldDistance: number, yFieldDistance: number): XAndYPos {
        return {
            xPos: colIndex * xFieldDistance,
            yPos: rowIndex * yFieldDistance
        }
    }

    handleMovingGesture(position: CanvasPosition, event: any) {
        let ship: Ship = this.retrieveShipForPosition(position);

        // this needs more work - still quite hacky
        if (ship) {
            // velocity can be quite difficult to handle - threshold makes it less yanky
            let thresholdFactor = 30;

            if (event.velocityX > 1 * thresholdFactor) {
                if ((ship.headPosition.col + ship.size) < this._columnCount)
                    ship.headPosition.col += 1;
            } else if (event.velocityX < -1 * thresholdFactor) {
                if (ship.headPosition.col > 0)
                    ship.headPosition.col -= 1;
            }

            if (event.velocityY > 1 * thresholdFactor) {
                if ((ship.headPosition.row + 1) < this._rowCount)
                    ship.headPosition.row += 1;
            } else if (event.velocityY < -1 * thresholdFactor) {
                if (ship.headPosition.row > 0)
                    ship.headPosition.row -= 1;
            }
        }
    }

    retrieveShipForPosition(position: CanvasPosition): Ship {
        let movingShip: Ship = null;

        this._ships.forEach(s => {
            if (this.isThisShipHit(s, position)) {
                movingShip = s;
            }
        });

        return movingShip;
    }

    isThisShipHit(ship: Ship, position: CanvasPosition): boolean {
        let xFieldDistance = this._playerBoardRenderInfo.width / 10;
        let yFieldDistance = this._playerBoardRenderInfo.height / 10;

        let maxXToBeHit: number;
        let maxYToBeHit: number;
        let minXToBeHit: number;
        let minYToBeHit: number;
        if (ship.orientation == ShipOrientation.Horizontal) {
            maxXToBeHit = ship.size * xFieldDistance + ship.headPosition.col * xFieldDistance;
            minXToBeHit = ship.headPosition.col * xFieldDistance;

            maxYToBeHit = (ship.headPosition.row + 1) * yFieldDistance;
            minYToBeHit = ship.headPosition.row * yFieldDistance;
        }

        if (position.x >= minXToBeHit && position.x <= maxXToBeHit
            && position.y >= minYToBeHit && position.y <= maxYToBeHit) {
            return true;
        } else {
            return false;
        }
    }

    // TODO Orientation Logic hast to be implemented
    updateHitMapWithShipPositions() {
        this._ships.forEach(ship => {
            let startRowIndex = ship.headPosition.row;
            let stopRowIndex;
            if (ship.orientation === ShipOrientation.Vertical) {
                stopRowIndex = startRowIndex + ship.size - 1;
            } else {
                stopRowIndex = startRowIndex;
            }

            let startColIndex = ship.headPosition.col;
            let stopColIndex;
            if (ship.orientation == ShipOrientation.Horizontal) {
                stopColIndex = startColIndex + ship.size - 1;
            } else {
                stopColIndex = startColIndex;
            }

            for (let i = startRowIndex; i <= stopRowIndex; i++) {
                for (let j = startColIndex; j <= stopColIndex; j++) {
                    this._cells[i][j] = HitMapFieldStates.Ship;
                }
            }
        });
    }
}

interface ShipConfiguration {
    clazz: ShipClass,
    piecesOnBoard: number
}

enum HitMapFieldStates {
    None,
    Ship,
    Hit,
    Miss
}

interface XAndYPos {
    xPos: number;
    yPos: number;
}