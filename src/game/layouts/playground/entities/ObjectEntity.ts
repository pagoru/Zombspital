import * as PIXI from "pixi.js";
import PIXISound from 'pixi-sound';
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
        this.zIndex += point.y + this.height;
    }

    public consume (player: Player) {
        Game.instance.canvas.playGroundLayout.destroyObjectEntity(this);

        const uwuSound = PIXISound.Sound.from(require('../../../../assets/object.mp3').default);
        uwuSound.volume = 0.25;
        uwuSound.play();
    };

}