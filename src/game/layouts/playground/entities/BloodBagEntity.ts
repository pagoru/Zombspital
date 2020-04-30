import * as PIXI from 'pixi.js';
import {ObjectEntity} from "./ObjectEntity";
import {Game} from "../../../Game";
import {Player} from "./Player";
import {Utils} from "../../../Utils";
import GetRandomNumber = Utils.GetRandomNumber;

export class BloodBagEntity extends ObjectEntity {

    private readonly min: number;
    private readonly max: number;

    constructor(
        min: number,
        max: number
    ) {
        super();
        this.min = min;
        this.max = max;
        const { getTexture } = Game.instance.canvas.textures;
        this.texture = getTexture('blood_bag');
    }

    public consume = (player: Player) => {
        super.consume(player);
        player.addZombiefication(- GetRandomNumber(this.min, this.max));
        Game.instance.canvas.uiLayout.scoreInterface
            .score.addScore(GetRandomNumber(10, 50));
    }
}