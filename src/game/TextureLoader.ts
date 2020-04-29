import * as PIXI from "pixi.js";

export class TextureLoader {

    public spriteSheet: PIXI.Spritesheet;

    constructor() {

    }

    public load = async () => {
        await new Promise((resolve, reject) => {
            const loader = new PIXI.Loader();
            loader.add('sprites', require('../assets/sprites.png').default);
            loader.on('progress', (l, resource) =>
                console.log(`loading texture "${resource.name}"`));
            loader.on('complete', (loader, resources) => {
                const sheet = new PIXI.Spritesheet(
                    resources.sprites.texture.baseTexture,
                    require('../assets/sprites.json')
                );
                sheet.parse(() => {
                    this.spriteSheet = sheet;
                    resolve();
                });
            });
            loader.on('error', reject);
            loader.load();
        })
    }

    public getTexture = (name: string): PIXI.Texture => this.spriteSheet.textures[name];

    public getEntityTextures = (name: string): Array<PIXI.Texture> => Array.from(Array(6).keys())
        .map((index) => this.getTexture(`${name}_${index}`));

    public getNumberTextures = (): Array<PIXI.Texture> => Array.from(Array(10).keys())
        .map((index) => this.getTexture(`text_${index}`));

    public getBloodTextures = (): Array<PIXI.Texture> => Array.from(Array(4).keys())
        .map((index) => this.getTexture(`blood_${index}`));

}