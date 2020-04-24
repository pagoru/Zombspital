
import * as PIXI from 'pixi.js';
import {Game} from "../Game";

export class PlayGroundScreen extends PIXI.Container {

    private readonly map: Array<Array<number>>;

    constructor() {
        super();
        this.map = require('../../assets/map.json');
    }

    public load = () => {
        this.map.forEach((arrX, y) => {
           arrX.forEach((tile, x) => {
               if(tile === -1) return;
               const _tile = new PIXI.Sprite(Game.instance.canvas.textures.getTexture(`tile_${tile}`));
               _tile.position.set(x * 16, y * 16);
               this.addChild(_tile);
           });
        });
    }

}