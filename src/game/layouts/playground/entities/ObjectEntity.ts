import * as PIXI from "pixi.js";
import {Game} from "../../../Game";
import {Utils} from "../../../Utils";
import GetRandomString = Utils.GetRandomString;
import {PlayerType} from "../../../types/PlayerType";
import {Player} from "./Player";

export class ObjectEntity extends PIXI.Sprite {

    public readonly id;

    constructor() {
        super();
        this.id = GetRandomString(10);
    }

    public setPosition (
        point: PIXI.Point
    ) {
        point.x -= Math.trunc(this.width / 2);
        point.y -= this.height;
        this.position.copyFrom(point);
        this.zIndex += point.y + 2;
    }

    public consume (player: Player) {
        Game.instance.canvas.playGroundLayout.destroyObjectEntity(this)
    };

}