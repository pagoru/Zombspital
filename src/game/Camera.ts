
import * as PIXI from 'pixi.js';
import {Game} from "./Game";
import {Canvas} from "./Canvas";

export class Camera {

    constructor() {

    }

    move = (pos: PIXI.Point) => {
        const canvasPosition = new PIXI.Point(
            pos.x * (Canvas.SCALED_SIZE.w + 4),
            pos.y * Canvas.SCALED_SIZE.h
        );
        const position = new PIXI.Point(
            -canvasPosition.x * Canvas.SCREEN_SCALE.x * Canvas.SCALE.x,
            -canvasPosition.y * Canvas.SCREEN_SCALE.y * Canvas.SCALE.y
        )
        const canvas = Game.instance.canvas;

        canvas.stage().position.copyFrom(position);
        canvas.uiLayout.position.copyFrom(canvasPosition);
        canvas.insertCoinInterface.position.copyFrom(canvasPosition);
        canvas.gameOverInterface.position.copyFrom(canvasPosition);
    }

}