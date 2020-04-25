
import * as PIXI from 'pixi.js';
import {Game} from "../../Game";
import {Canvas} from "../../Canvas";

export class ScoreInterface extends PIXI.Container {

    private readonly leftHeart: PIXI.Sprite;
    private readonly rightHeart: PIXI.Sprite;

    private readonly leftZombiefication: PIXI.Sprite;
    private readonly rightZombiefication: PIXI.Sprite;

    private readonly textScore: PIXI.Sprite;

    private readonly leftZombieficationGraphics: PIXI.Graphics;
    private readonly rightZombieficationGraphics: PIXI.Graphics;

    constructor() {
        super();

        this.leftHeart = new PIXI.Sprite(Game.instance.canvas.textures.getTexture('leftHeart'));
        this.leftHeart.position.set(1, 1);

        this.textScore = new PIXI.Sprite(Game.instance.canvas.textures.getTexture('text_score'));
        this.textScore.position.set(this.leftHeart.position.x + 1 + this.leftHeart.width, 1);

        this.rightHeart = new PIXI.Sprite(Game.instance.canvas.textures.getTexture('rightHeart'));
        this.rightHeart.position.set(this.textScore.position.x + 1 + this.textScore.width, 1);

        this.leftZombiefication = new PIXI.Sprite(Game.instance.canvas.textures.getTexture('leftZombiefication'));
        this.leftZombiefication.position.set(9, 3);

        this.leftZombieficationGraphics = new PIXI.Graphics();
        this.leftZombieficationGraphics.beginFill(0xFF3300);
        this.leftZombieficationGraphics.drawPolygon([
            0, 0,
            4, 0,
            4, 4,
            0, 4
        ]);
        this.leftZombieficationGraphics.endFill();

        this.leftZombiefication.addChild(this.leftZombieficationGraphics)
        this.leftZombiefication.mask = this.leftZombieficationGraphics;

        this.rightZombiefication = new PIXI.Sprite(Game.instance.canvas.textures.getTexture('rightZombiefication'));
        this.rightZombiefication.position.set(87, 3);

        this.rightZombieficationGraphics = new PIXI.Graphics();
        this.rightZombieficationGraphics.beginFill(0xFF3300);
        this.rightZombieficationGraphics.drawPolygon([
            0, 0,
            -4, 0,
            -4, 4,
            0, 4
        ]);
        this.rightZombieficationGraphics.position.set(this.rightZombiefication.width, 0);
        this.rightZombieficationGraphics.endFill();

        this.rightZombiefication.addChild(this.rightZombieficationGraphics)
        this.rightZombiefication.mask = this.rightZombieficationGraphics;

        this.addChild(
            this.leftHeart,
            this.leftZombiefication,

            // this.rightHeart,
            // this.rightZombiefication,

            this.textScore
        );
    }

    public addSecondPlayer = () => {
        this.addChild(this.rightHeart, this.rightZombiefication);
    }

}