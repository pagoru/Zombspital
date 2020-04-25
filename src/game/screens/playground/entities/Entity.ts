
import * as PIXI from 'pixi.js';

export class Entity extends PIXI.AnimatedSprite {

    constructor(textures: PIXI.Texture[]) {
        super(textures);
    }

    public addPosition = (
        x: number,
        y: number
    ) => {
        this.position.x += x;
        this.position.y += y;
        this.zIndex += y;
        console.log(this.zIndex)
    }
}