
import * as PIXI from "pixi.js";
import {ObjectEntity} from "./ObjectEntity";
import {Game} from "../../../Game";
import {Player} from "./Player";
import {Utils} from "../../../Utils";
import GetRandomNumber = Utils.GetRandomNumber;

export class CakeEntity extends ObjectEntity {

    private readonly martaText: PIXI.Sprite;
    private readonly loveSprites: Array<PIXI.Sprite>;

    constructor() {
        super();
        const { getTexture } = Game.instance.canvas.textures;
        this.texture = getTexture('cake');

        this.martaText = new PIXI.Sprite(getTexture('text_marta'));
        this.martaText.pivot.set(Math.trunc(this.martaText.width / 2 - this.width / 2), Math.trunc(this.martaText.height / 2))
        this.martaText.zIndex = Number.MAX_SAFE_INTEGER;
        const heartTexture = getTexture('love');

        this.loveSprites = new Array<PIXI.Sprite>();
        for (let i = 0; i < 10; i++) {
            this.loveSprites.push(new PIXI.Sprite(heartTexture));
            this.loveSprites[i].zIndex = Number.MAX_SAFE_INTEGER;
        }
    }
    public setPosition = (
        point: PIXI.Point
    ) => {
        super.setPosition(point);
        this.martaText.position.copyFrom(this.position);
        this.loveSprites.forEach(ls => ls.position.set(this.position.x + GetRandomNumber(-20, 20), this.position.y + GetRandomNumber(-10, 10)));
    }

    public consume = (player: Player) => {
        super.consume(player);
        Game.instance.canvas.on("loop4", this.onLoop4);
        Game.instance.canvas.on("loop8", this.onLoop8);
        player.addZombiefication(- player.getZombiefication())
        Game.instance.canvas.playGroundLayout
            .addChild(this.martaText, ...this.loveSprites);
        Game.instance.canvas.uiLayout.scoreInterface
            .score.addScore(284);
    }

    public onLoop8 = (delta: number) => this.martaText.position.y -= delta;

    public onLoop4 = (delta: number) => {
        this.loveSprites.forEach(ls => {
            ls.position.y -= delta;
            ls.alpha -= 0.025;
        });
        if(0 >= this.loveSprites[0].alpha)
            this.martaText.alpha -= 0.025;
        if(0 < this.martaText.alpha) return;

        Game.instance.canvas.playGroundLayout.removeChild(this.martaText, ...this.loveSprites);
        Game.instance.canvas.removeListener('loop4', this.onLoop4);
        Game.instance.canvas.removeListener('loop8', this.onLoop8);
    }

}