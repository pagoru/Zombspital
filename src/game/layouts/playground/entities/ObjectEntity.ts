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
        x: number,
        y: number
    ) {
        this.position.copyFrom(new PIXI.Point(x, y));
        this.zIndex += y;
    }

    public consume (player: Player) {
        Game.instance.canvas.playGroundLayout.destroyObjectEntity(this)
    };

}