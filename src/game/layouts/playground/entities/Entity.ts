
import * as PIXI from 'pixi.js';

export class Entity extends PIXI.Container {

    protected readonly animatedSprite: PIXI.AnimatedSprite;

    constructor(textures: PIXI.Texture[]) {
        super();
        this.animatedSprite = new PIXI.AnimatedSprite(textures);
        this.addChild(this.animatedSprite)
    }

    public addPosition = (
        x: number,
        y: number
    ) => {
        this.position.x += x;
        this.position.y += y;
        this.zIndex += y;
    }
}