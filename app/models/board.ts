import {Ship, ShipClass, HeadPosition} from './ship';
import {RenderInformation} from './renderinformation';

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
        this._ships.forEach(ship => {
            let xFieldDistance = renderInfo.width / 10;
            let yFieldDistance = renderInfo.height / 10;

            let xDrawPos = ship.headPosition.col * xFieldDistance; // this should be changed xD
            let yDrawPos = ship.headPosition.row * yFieldDistance;
            let drawWidth = ship.size * xFieldDistance;
            let drawHeight = 1 * yFieldDistance;

            renderInfo.context.fillRect(xDrawPos, yDrawPos, drawWidth, drawHeight);
        });
    }
}

interface ShipConfiguration {
    clazz: ShipClass,
    piecesOnBoard: number
}