import * as PIXI from 'pixi.js';
import {ObjectEntity} from "./ObjectEntity";
import {Game} from "../../../Game";
import {Player} from "./Player";
import {Utils} from "../../../Utils";
import GetRandomNumber = Utils.GetRandomNumber;

export class ToiletPaperEntity extends ObjectEntity {

    constructor() {
        super();
        const { getTexture } = Game.instance.canvas.textures;
        this.texture = getTexture('toilet_paper');
    }

    public consume = (player: Player) => {
        super.consume(player);
        Game.instance.canvas.uiLayout.scoreInterface
            .score.addScore(GetRandomNumber(100, 500));
    }
}