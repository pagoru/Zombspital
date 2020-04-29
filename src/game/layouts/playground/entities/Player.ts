
import * as PIXI from 'pixi.js';
import {Entity} from "./Entity";
import {Game} from "../../../Game";
import {PlayerType} from "../../../types/PlayerType";
import {Key} from "ts-key-enum";
import {PlayerDirection} from "../../../types/PlayerDirection";
import {Utils} from "../../../Utils";
import GetRandomNumber = Utils.GetRandomNumber;
import {Zombie} from "./Zombie";

export class Player extends Entity {

    public readonly type: PlayerType;

    private keyDownArray: Array<PlayerDirection>;

    private zombiefication: number;
    private zombieficationInterval: any;

    private requestChangeRoom: PIXI.Point;

    private _isDead: boolean;

    constructor(type: PlayerType = 'solo') {
        super( type === 'solo' || type === 'p1' ? 'marta' : 'pablo');
        this.type = type;

        this.keyDownArray = new Array<PlayerDirection>();

        this.animatedSprite.onFrameChange = this._onFrameChange;
        this.animatedSprite.animationSpeed = 0.125;

        this.zombiefication = 0;

        this.on('added', this.onAdded);
        this.on('removed', this.onRemoved);

        if(type === 'solo') return;
        const indicator = new PIXI.Sprite(Game.instance.canvas.textures.getTexture(type));
        indicator.position.set(- indicator.width / 2, - this.height - indicator.height - 2)
        this.addChild(indicator);
        if(type === 'p2') return;
        Game.instance.canvas.uiLayout.scoreInterface.addSecondPlayer();
    }

    private onAdded = () => {
        Game.instance.canvas.on('loop4', this.onLoop4);
        Game.instance.keyboard.on(this.onKeyboard);
        this.on('position_changed', this.onPositionChange);

        this.zombieficationInterval = setInterval(() => {
            this.addZombiefication(Math.random() * 2);
            this.addBlood();
        }, 500);
    }

    private onPositionChange = (position: PIXI.Point) => {
        const playGroundLayout = Game.instance.canvas.playGroundLayout;
        const currentRoomPositionCorrected = playGroundLayout.getCurrentRoomPositionCorrected();
        const currentRoomMaxPositionCorrected = playGroundLayout.getCurrentRoomMaxPositionCorrected();

        const objectCollided = Game.instance.canvas.playGroundLayout.getCollidingObjectEntities(this.position);
        if(objectCollided) objectCollided.consume(this);

        if(position.x + 1 === currentRoomMaxPositionCorrected.x)
            return this.requestChangeRoom = new PIXI.Point(1, 0)
        if(position.x === currentRoomPositionCorrected.x)
            return this.requestChangeRoom = new PIXI.Point(-1, 0)
        if(position.y + 1 === currentRoomMaxPositionCorrected.y)
            return this.requestChangeRoom = new PIXI.Point(0, 1)
        if(position.y === currentRoomPositionCorrected.y)
            return this.requestChangeRoom = new PIXI.Point(0, -1)

        return this.requestChangeRoom = null;
    }

    public getRequestChangeRoom = () => this.requestChangeRoom;

    private addBlood = () => {
        const blood = new PIXI.Sprite(Game.instance.canvas.textures.getBloodTextures()[GetRandomNumber(0, 3)]);
        blood.position.set(this.position.x - 4, this.position.y - 4)
        blood.zIndex = blood.position.y;
        blood.pivot = new PIXI.Point(GetRandomNumber(-1, 1), GetRandomNumber(-1, 1))
        Game.instance.canvas.playGroundLayout.addChild(blood);
    }

    private onRemoved = () => {
        this._isDead = true;
        clearInterval(this.zombieficationInterval);
        Game.instance.canvas.removeListener('loop4', this.onLoop4);
        Game.instance.keyboard.removeListener(this.onKeyboard);
        this.removeListener('position_changed', this.onPositionChange);

        if(this.type === 'solo') return;
        const zombie = new Zombie();
        zombie.addPosition(this.position.x, this.position.y);
        zombie.animatedSprite.gotoAndStop(this.animatedSprite.currentFrame);
        Game.instance.canvas.playGroundLayout.addZombie(zombie)
    }

    public addZombiefication = (amount: number) => {
        this.zombiefication += amount;
        Game.instance.canvas.uiLayout.scoreInterface.setZombiefication(this.type, this.zombiefication);
    }
    public getZombiefication = () => this.zombiefication;

    public _onFrameChange = (frame: number) => {
        if(!this.animatedSprite.playing) return;

        switch (frame) {
            case 3:
                return this.animatedSprite.gotoAndPlay(1);
            case 0:
                return this.animatedSprite.gotoAndPlay(4);
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

    public isDead = () => this._isDead;
    private isDown = (direction: PlayerDirection) => this.keyDownArray.some(k => k === direction);

    private onKeyboard = (data: {code: string, key: Key | string, isDown: boolean}) => {
        const player1 = this.type === 'p1' || this.type === 'solo';

        const setConfig = (direction: PlayerDirection) => {
            if(data.isDown && !this.isDown(direction)) {
                this.keyDownArray.push(direction);
                switch (direction) {
                    case PlayerDirection.DOWN:
                    case PlayerDirection.RIGHT:
                        this.animatedSprite.gotoAndPlay(1);
                        break;
                    case PlayerDirection.UP:
                    case PlayerDirection.LEFT:
                        this.animatedSprite.gotoAndPlay(4);
                        break;
                }
            }
            if(!data.isDown){
                this.keyDownArray = this.keyDownArray.filter(k => k !== direction);
                if(this.keyDownArray.length > 0) return;
                switch (direction) {
                    case PlayerDirection.DOWN:
                    case PlayerDirection.RIGHT:
                        this.animatedSprite.gotoAndStop(0);
                        break;
                    case PlayerDirection.UP:
                    case PlayerDirection.LEFT:
                        this.animatedSprite.gotoAndStop(3);
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
            case player1 ? 'KeyP' : 'NOT_A_CODE':
                Game.instance.canvas.playGroundLayout.loadPlayer2();
                break;
            case player1 ? 'KeyQ' : 'KeyR':
                // this.addBlood()
                Game.instance.canvas.uiLayout.scoreInterface.score.addScore(1)
                break;
        }
    }
}