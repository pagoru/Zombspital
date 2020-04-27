import * as PIXI from 'pixi.js';
import {Grid, Util, BestFirstFinder} from 'pathfinding';
import {Game} from "./Game";
import {Canvas} from "./Canvas";

export namespace PathFinding {

    export const GetPath = (_fromPoint: PIXI.IPoint, _toPoint: PIXI.IPoint) => {
        const fromPoint = new PIXI.Point().copyFrom(_fromPoint)
        const toPoint = new PIXI.Point().copyFrom(_toPoint)

        const roomPos = Game.instance.canvas.playGroundLayout.getCurrentRoomPosition();

        const minX = roomPos.x * Canvas.SCALED_SIZE.w;
        const minY = roomPos.y * Canvas.SCALED_SIZE.h;

        const grid = Game.instance.canvas.playGroundLayout.getCurrentPathRoomBounds();
        if(!grid) return [];

        toPoint.copyFrom(new PIXI.Point(toPoint.x - minX, toPoint.y - minY));
        fromPoint.copyFrom(new PIXI.Point(fromPoint.x - minX, fromPoint.y - minY));

        const pathFinder = new BestFirstFinder({
            allowDiagonal: true
        });
        let finder = pathFinder.findPath(
            fromPoint.x,
            fromPoint.y,
            toPoint.x,
            toPoint.y,
            new Grid(grid)
        )
        return Util
            .compressPath(finder)
            .map(coordinate => new PIXI.Point(Math.floor((coordinate[0] + minX)), Math.floor((coordinate[1] + minY))))
            .filter((p, i) => i !== 0)

    }

}
