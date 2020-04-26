
import * as PIXI from 'pixi.js';
import {Game} from "../Game";
import {Player} from "./playground/entities/Player";
import {PlayerType} from "../types/PlayerType";
import {MapType} from "../types/MapType";

export class PlayGroundLayout extends PIXI.Container {

    private player1: Player;
    private player2: Player;

    private readonly map: MapType;
    private currentRoomPosition: PIXI.Point;

    constructor() {
        super();
        this.map = require('../../assets/map.json');
        this.sortableChildren = true;
        this.currentRoomPosition = new PIXI.Point(0, 0);
    }

    public load = () => {
        this.loadMap();

        this.player1 = new Player('p1');
        this.player1.addPosition(20, 20, true);
        this.player2 = new Player('p2');
        this.player2.addPosition(24, 20, true);
        this.addChild(this.player1, this.player2)
    }

    private loadMap = () => {
        this.getCurrentRoom().tiles.forEach((arrX, y) => {
            arrX.forEach((tile, x) => {
                if(tile === -1) return;
                const _tileBlock = new PIXI.Sprite(Game.instance.canvas.textures.getTexture(`tile_${tile}`));
                _tileBlock.position.set(x * 16, y * 16);
                _tileBlock.zIndex = _tileBlock.position.y - (tile === 0 ? 32 : 0) + 16;
                this.addChild(_tileBlock);
            });
        });
    }

    public getCurrentRoomPosition = () => this.currentRoomPosition;
    public getCurrentRoom = () => this.map
        .find(room => this.currentRoomPosition.x === room.x && this.currentRoomPosition.y === room.y);

    public getCurrentRoomBounds = () => this.getCurrentRoom().tiles
        .map(arrX => arrX.map(tile => tile === 0 ? 0 : 1));

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