export class BoardUtil {

    // for infos of this function there is a link to that
    // http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/   
    static getPositionOnCanvas(evt: MouseEvent, canvasViewChild: any): CanvasPosition {
        let canvas: HTMLCanvasElement = canvasViewChild.nativeElement;
        let rect = canvas.getBoundingClientRect();

        return {
            x: Math.round(
                (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width),
            y: Math.round(
                (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height)
        };
    }

    static computeCanvasDimensions(): CanvasDimensions {
        return {
            'width': window.innerWidth,
            'height': window.innerHeight - 200
        }
    }

    static renderFieldLines(dimensions: CanvasDimensions,
        ctx: CanvasRenderingContext2D, rowCount: number, columnCount: number) {
        let lastColumnVal = this.renderColumns(dimensions, ctx, columnCount);
        this.renderRows(dimensions, ctx, rowCount, lastColumnVal);
    }

    static renderColumns(dimensions: CanvasDimensions,
        ctx: CanvasRenderingContext2D, columnCount: number): number {
        let columnDistance = dimensions.width / columnCount;
        
        let lastColumnXVal;
        for (let i = 0; i <= dimensions.width; i += columnDistance) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, dimensions.height);
            ctx.stroke();
            ctx.closePath();

            lastColumnXVal = i;
        }
        
        return lastColumnXVal;
    }

    static renderRows(dimensions: CanvasDimensions,
        ctx: CanvasRenderingContext2D, rowCount: number, lastColumnXVal: number) {
        let rowDistance = dimensions.height / rowCount;

        for (let i = 0; i <= dimensions.height; i += rowDistance) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(lastColumnXVal, i);
            ctx.stroke();
            ctx.closePath();
        }
    }

}

export interface CanvasDimensions {
    width: number;
    height: number;
}

export interface CanvasPosition {
    x: number,
    y: number
}