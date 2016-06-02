import {Ship, ShipClass, HeadPosition, ShipOrientation} from './ship';
import {RenderInformation} from './renderinformation';
import {CanvasPosition} from '../pages/game-board/game-board';

export class Board {

    private _shipsPerPlayer: Array<ShipConfiguration> = [
        { clazz: ShipClass.Battleship, piecesOnBoard: 1 },
        { clazz: ShipClass.Carrier, piecesOnBoard: 1 },
        { clazz: ShipClass.Cruiser, piecesOnBoard: 1 },
        { clazz: ShipClass.Destroyer, piecesOnBoard: 2 },
        { clazz: ShipClass.Submarine, piecesOnBoard: 2 }
    ]

    private _cells: Array<Array<number>>;
    private _ships: Array<Ship>;

    private _renderInfo: RenderInformation;

    constructor(private _columnCount = 10, private _rowCount = 10) {
        this.primeBoardCells();
        this.primeShipsOnBoard();

        console.log(this);
    }

    primeBoardCells() {
        this._cells = new Array<Array<number>>();

        for (let i = 0; i < this._columnCount; i++) {
            this._cells.push(new Array());

            for (let j = 0; j < this._rowCount; j++) {
                this._cells[i].push(0);
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
        if (!this._renderInfo) {
            this._renderInfo = renderInfo;
        }

        this._ships.forEach(ship => {
            let xFieldDistance = renderInfo.width / 10;
            let yFieldDistance = renderInfo.height / 10;

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

    handleMovingGesture(position: CanvasPosition, event: any) {
        let ship: Ship = this.retrieveShipForPosition(position);

        // this needs more work - still quite hacky
        if (ship) {
            // velocity can be quite difficult to handle - threshold makes it less yanky
            let thresholdFactor = 30;

            if (event.velocityX > 1 * thresholdFactor) {
                if ((ship.headPosition.col + ship.size) < 10)
                    ship.headPosition.col += 1;
            } else if (event.velocityX < -1 * thresholdFactor) {
                if (ship.headPosition.col > 0)
                    ship.headPosition.col -= 1;
            }

            if (event.velocityY > 1 * thresholdFactor) {
                if ((ship.headPosition.row + 1) < 10)
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
        let xFieldDistance = this._renderInfo.width / 10;
        let yFieldDistance = this._renderInfo.height / 10;

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
            console.log('ship is hit!');
            return true;
        } else {
            return false;
        }
    }
}

interface ShipConfiguration {
    clazz: ShipClass,
    piecesOnBoard: number
}