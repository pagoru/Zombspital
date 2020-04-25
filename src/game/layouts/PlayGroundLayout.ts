
import * as PIXI from 'pixi.js';
import {Game} from "../Game";
import {Player} from "./playground/entities/Player";
import {PlayerType} from "../types/PlayerType";

export class PlayGroundLayout extends PIXI.Container {

    private player1: Player;
    private player2: Player;

    private readonly map: Array<Array<number>>;

    constructor() {
        super();
        this.map = require('../../assets/map.json');
        this.sortableChildren = true;
    }

    public load = () => {
        this.loadMap();

        this.player1 = new Player('p1');
        this.player2 = new Player('p2');
        this.addChild(this.player1, this.player2)
    }

    private loadMap = () => {
        this.map.forEach((arrX, y) => {
            arrX.forEach((tile, x) => {
                if(tile === -1) return;
                const _tileBlock = new PIXI.Sprite(Game.instance.canvas.textures.getTexture(`tile_${tile}`));
                _tileBlock.position.set(x * 16, y * 16);
                _tileBlock.zIndex = _tileBlock.position.y - (tile === 0 ? 16 : 0);
                this.addChild(_tileBlock);
            });
        });
    }

    public killPlayer = (type: PlayerType) => {
        switch (type) {
            case "solo":
            case "p1":
                this.removeChild(this.player1);
                break;
            case "p2":
                this.removeChild(this.player2);
                break;
        }
    }

}