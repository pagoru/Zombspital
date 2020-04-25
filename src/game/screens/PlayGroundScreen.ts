
import * as PIXI from 'pixi.js';
import {Game} from "../Game";
import {Player} from "./playground/entities/Player";

export class PlayGroundScreen extends PIXI.Container {

    private player1: Player;
    private player2: Player;

    private readonly map: Array<Array<number>>;

    constructor() {
        super();
        this.map = require('../../assets/map.json');
        this.sortableChildren = true;
    }

    public load = () => {
        this.player1 = new Player('p1');
        this.player2 = new Player('p2');

        this.map.forEach((arrX, y) => {
           arrX.forEach((tile, x) => {
               if(tile === -1) return;
               const _tile = new PIXI.Sprite(Game.instance.canvas.textures.getTexture(`tile_0`));
               _tile.position.set(x * 16, y * 16);
               _tile.zIndex = Number.MIN_SAFE_INTEGER;
               this.addChild(_tile);
               if(tile === 0) return;
               const _tileBlock = new PIXI.Sprite(Game.instance.canvas.textures.getTexture(`tile_${tile}`));
               _tileBlock.position.set(x * 16, y * 16);
               _tileBlock.zIndex = _tileBlock.position.y;
               this.addChild(_tileBlock);
           });
        });
        this.addChild(this.player1, this.player2)
    }

}