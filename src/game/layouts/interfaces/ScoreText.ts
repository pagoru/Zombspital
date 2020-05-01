
import * as PIXI from 'pixi.js';
import {Game} from "../../Game";

export class ScoreText extends PIXI.Container {

    private actualScore: number;

    constructor() {
        super();
        this.actualScore = 0;
        this.addScore(0);
    }

    public reset = () => this.addScore(- this.actualScore);

    public addScore = (amount: number) => {
        this.actualScore += amount

        const numbers = `${this.actualScore}`
            .split('')
            .map(num => new PIXI.Sprite(Game.instance.canvas.textures.getNumberTextures()[parseInt(num)]));

        numbers.forEach((sprite, index) => {
            if(index === 0) return;
            const pre = numbers[index - 1];
            sprite.position.set(pre.position.x + pre.width - 1, 0)
        })

        this.removeChildren();
        this.addChild(...numbers);
        this.pivot.x = Math.trunc(this.width / 2);
    }

}