import {Entity} from "./Entity";
import {Game} from "../../../Game";
import {PlayerType} from "../../../types/PlayerType";
import {Key} from "ts-key-enum";
import {PlayerDirection} from "../../../types/PlayerDirection";

export class Player extends Entity {

    private readonly type: PlayerType;

    private keyDownArray: Array<PlayerDirection>;

    constructor(type: PlayerType = 'solo') {
        super(Game.instance.canvas.textures.getPlayerTextures());
        this.type = type;

        this.keyDownArray = new Array<PlayerDirection>();

        Game.instance.canvas.on('loop4', this.onLoop4);
        Game.instance.keyboard.on(this.onKeyboard);

        this.onFrameChange = this._onFrameChange;
        this.animationSpeed = 0.125;
    }

    public _onFrameChange = (frame: number) => {
        switch (frame) {
            case 3:
                return this.gotoAndPlay(1);
            case 8:
                return this.gotoAndPlay(6);
        }
    }

    private onLoop4 = (delta) => {
        if(this.isDown(PlayerDirection.UP))
            this.addPosition(0, -delta);
        if(this.isDown(PlayerDirection.DOWN))
            this.addPosition(0, delta);
        if(this.isDown(PlayerDirection.RIGHT))
            this.addPosition(delta, 0);
        if(this.isDown(PlayerDirection.LEFT))
            this.addPosition(-delta, 0);
    }

    private isDown = (direction: PlayerDirection) => this.keyDownArray.some(k => k === direction);

    private onKeyboard = (data: {code: string, key: Key | string, isDown: boolean}) => {
        const player1 = this.type === 'p1' || this.type === 'solo';

        const setConfig = (direction: PlayerDirection) => {
            if(data.isDown && !this.isDown(direction)) {
                this.keyDownArray.push(direction);
                switch (direction) {
                    case PlayerDirection.DOWN:
                    case PlayerDirection.RIGHT:
                        this.gotoAndPlay(0);
                        break;
                    case PlayerDirection.UP:
                    case PlayerDirection.LEFT:
                        this.gotoAndPlay(5);
                        break;
                }
            }
            if(!data.isDown){
                this.keyDownArray = this.keyDownArray.filter(k => k !== direction);
                if(this.keyDownArray.length > 0) return;
                switch (direction) {
                    case PlayerDirection.DOWN:
                    case PlayerDirection.RIGHT:
                        this.gotoAndStop(0);
                        break;
                    case PlayerDirection.UP:
                    case PlayerDirection.LEFT:
                        this.gotoAndStop(5);
                        break;
                }
            }
        }

        switch (data.code) {
            case player1 ? 'KeyW' : 'ArrowUp':
                setConfig(PlayerDirection.UP)
                break;
            case player1 ? 'KeyS' : 'ArrowDown':
                setConfig(PlayerDirection.DOWN)
                break;
            case player1 ? 'KeyD' : 'ArrowRight':
                setConfig(PlayerDirection.RIGHT)
                break;
            case player1 ? 'KeyA' : 'ArrowLeft':
                setConfig(PlayerDirection.LEFT)
                break;
        }
    }

}