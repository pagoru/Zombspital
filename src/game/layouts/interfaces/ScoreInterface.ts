
import * as PIXI from 'pixi.js';
import {Game} from "../../Game";
import {Canvas} from "../../Canvas";
import {PlayerType} from "../../types/PlayerType";
import {ScoreText} from "./ScoreText";

export class ScoreInterface extends PIXI.Container {

    private readonly leftHeart: PIXI.AnimatedSprite;
    private readonly rightHeart: PIXI.AnimatedSprite;

    private readonly leftZombiefication: PIXI.Sprite;
    private readonly rightZombiefication: PIXI.Sprite;

    private readonly scoreLabel: PIXI.Sprite;

    private readonly leftZombieficationGraphics: PIXI.Graphics;
    private readonly rightZombieficationGraphics: PIXI.Graphics;

    public readonly score: ScoreText;

    constructor() {
        super();
        const textures = Game.instance.canvas.textures;

        this.leftHeart = new PIXI.AnimatedSprite([
            textures.getTexture('leftHeart'),
            textures.getTexture('leftZombieHeart')
        ]);
        this.leftHeart.position.set(1, 1);

        this.scoreLabel = new PIXI.Sprite(textures.getTexture('text_score'));
        this.scoreLabel.position.set(this.leftHeart.position.x + 1 + this.leftHeart.width, 1);

        this.score = new ScoreText();
        this.score.position.set(
            this.scoreLabel.position.x + (this.scoreLabel.width / 2),
            this.scoreLabel.position.y + this.scoreLabel.height + 2
        )

        this.rightHeart = new PIXI.AnimatedSprite([
            textures.getTexture('rightHeart'),
            textures.getTexture('rightZombieHeart')
        ]);
        this.rightHeart.position.set(this.scoreLabel.position.x + 1 + this.scoreLabel.width, 1);

        this.leftZombiefication = new PIXI.Sprite(textures.getTexture('leftZombiefication'));
        this.leftZombiefication.position.set(9, 3);

        this.leftZombieficationGraphics = new PIXI.Graphics();
        this.leftZombieficationGraphics.endFill();

        this.leftZombiefication.addChild(this.leftZombieficationGraphics)
        this.leftZombiefication.mask = this.leftZombieficationGraphics;

        this.rightZombiefication = new PIXI.Sprite(textures.getTexture('rightZombiefication'));
        this.rightZombiefication.position.set(87, 3);

        this.rightZombieficationGraphics = new PIXI.Graphics();
        this.rightZombieficationGraphics.position.set(this.rightZombiefication.width, 0);
        this.rightZombieficationGraphics.endFill();

        this.rightZombiefication.addChild(this.rightZombieficationGraphics)
        this.rightZombiefication.mask = this.rightZombieficationGraphics;

        this.addChild(
            this.leftHeart,
            this.leftZombiefication,

            this.scoreLabel,
            this.score
        );
    }

    public addSecondPlayer = () => {
        this.addChild(this.rightHeart, this.rightZombiefication);
    }

    public setZombiefication = (playerType: PlayerType, amount: number) => {
        const x = (this.leftZombiefication.width / 100) * amount
        const isAZombie = amount > 100;
        switch (playerType) {
            case "solo":
            case "p1":
                this.leftZombieficationGraphics.clear();
                this.leftZombieficationGraphics.beginFill(0xFF3300);
                this.leftZombieficationGraphics.drawPolygon([ 0, 0, x, 0, x, 4, 0, 4 ]);
                this.leftZombieficationGraphics.endFill();

                if(!isAZombie) break;
                this.leftHeart.gotoAndStop(1);
                this.removeChild(this.leftZombiefication);
                break;
            case "p2":
                this.rightZombieficationGraphics.clear();
                this.rightZombieficationGraphics.beginFill(0xFF3300);
                this.rightZombieficationGraphics.drawPolygon([ 0, 0, - x, 0, - x, 4, 0, 4 ]);
                this.rightZombieficationGraphics.endFill()

                if(!isAZombie) break;
                this.rightHeart.gotoAndStop(1);
                this.removeChild(this.rightZombiefication);
                break;
        }
        if(isAZombie)
            Game.instance.canvas.playGroundLayout.killPlayer(playerType);
    }

}