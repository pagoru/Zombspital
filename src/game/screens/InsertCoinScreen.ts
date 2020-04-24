
import * as PIXI from 'pixi.js';
import {Canvas} from "../Canvas";
import {Game} from "../Game";

export class InsertCoinScreen extends PIXI.Container {

    private readonly logo: PIXI.Sprite;
    private readonly insertCoin: PIXI.Sprite;

    private logoDirection: 'down' | 'up' = 'down';
    private logoYPosition: number = 0;
    private insertCoinAlpha: 'show' | 'hide' = 'show';

    constructor() {
        super();

        this.logo = new PIXI.Sprite();
        this.insertCoin = new PIXI.Sprite();
        this.addChild(this.logo, this.insertCoin);
    }

    public load = () => {
        const canvas = Game.instance.canvas;
        const textures = canvas.textures;

        this.logo.texture = textures.spriteSheet.textures['logo'];
        this.logo.pivot.set(this.logo.width / 2, this.logo.height / 2 - 10);
        this.logo.position.set(Canvas.SCALED_SIZE.w / 2, this.logo.height / 2)

        this.insertCoin.texture = textures.getTexture('insertCoin');
        this.insertCoin.pivot.set(this.insertCoin.width / 2, this.insertCoin.height / 2);
        this.insertCoin.position.set(Canvas.SCALED_SIZE.w / 2, Canvas.SCALED_SIZE.h / 2 + 30)

        this.addChild(this.logo, this.insertCoin);

        canvas.on('loop15', this.loop15);
    }

    private loop15 = (delta: number) => {
        switch (this.logoDirection) {
            case "down":
                this.logo.position.y += delta;
                this.logoYPosition += delta;
                if(this.logoYPosition > 5)
                    this.logoDirection = 'up';
                break;
            case "up":
                this.logo.position.y -= delta;
                this.logoYPosition -= delta;
                if(this.logoYPosition < 0)
                    this.logoDirection = 'down';
                break;
        }
        switch (this.insertCoinAlpha) {
            case "hide":
                this.insertCoin.alpha -= 0.125;
                if(0 >= this.insertCoin.alpha)
                    this.insertCoinAlpha = 'show'
                break;
            case "show":
                this.insertCoin.alpha += 0.125;
                if(this.insertCoin.alpha >= 1)
                    this.insertCoinAlpha = 'hide'
                break;
        }
    }

}