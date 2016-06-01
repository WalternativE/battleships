export class Ship {

    private _shipClass: ShipClass;
    get shipClass() {
        return this._shipClass;
    }

    private _size: number;
    get size() {
        return this._size;
    }
    
    private _headPosition: HeadPosition;
    get headPosition() {
        return this._headPosition;
    }
    
    private _orientation: ShipOrientation;
    get orientation() {
        return this._orientation;
    }
        
    constructor(shipClass: ShipClass, headPosition: HeadPosition) {
        this._shipClass = shipClass;
        this._size = shipClass.valueOf();
        
        this._headPosition = headPosition;
        this._orientation = ShipOrientation.Horizontal;
    }
}

export enum ShipClass {
    Carrier = 5,
    Battleship = 4,
    Cruiser = 3,
    Destroyer = 2,
    Submarine = 1
}

export enum ShipOrientation {
    Horizontal,
    Vertical
}

export interface HeadPosition {
    row: number;
    col: number;
}