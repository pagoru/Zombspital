
import * as PIXI from 'pixi.js';

export class Entity extends PIXI.Container {

    public readonly animatedSprite: PIXI.AnimatedSprite;

    constructor(textures: PIXI.Texture[]) {
        super();
        this.animatedSprite = new PIXI.AnimatedSprite(textures);
        this.animatedSprite.pivot.set(this.animatedSprite.width / 2, this.animatedSprite.height);
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