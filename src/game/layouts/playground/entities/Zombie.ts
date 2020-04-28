import {Entity} from "./Entity";
import {Game} from "../../../Game";
import {PathFinding} from "../../../PathFinding";
import {PlayerDirection} from "../../../types/PlayerDirection";

export class Zombie extends Entity {

    private findInterval: any;
    private goto: Array<PIXI.Point>;

    private difficulty: '8' |'4';

    private currentDirection: PlayerDirection;
    
    constructor(hard: boolean = false) {
        super('zombie');

        this.difficulty = hard ? '4' : '8';
        this.goto = [];

        this.animatedSprite.onFrameChange = this._onFrameChange;
        this.animatedSprite.animationSpeed = 0.125;

        this.currentDirection = PlayerDirection.DOWN;

        this.on('added', this.onAdded);
        this.on('removed', this.onRemoved);
    }

    private onAdded = () => {
        Game.instance.canvas.on(`loop${this.difficulty}`, this.onLoop4);
        this.findInterval = setInterval(() => {
            const playGround = Game.instance.canvas.playGroundLayout;
            if(playGround.arePlayersDead()) return;

            const playerToGo = playGround.getPlayers()[0].position;

            const path = PathFinding.GetPath(this.position, playerToGo);
            if(path.length === 0) return;
            this.goto = path;
        }, 500);
    }

    private onRemoved = () => {
        Game.instance.canvas.removeListener('loop4', this.onLoop4);
        clearInterval(this.findInterval)
    }

    private onLoop4 = (delta) => {
        if(this.goto.length === 0) {
            switch (this.currentDirection) {
                case PlayerDirection.DOWN:
                case PlayerDirection.RIGHT:
                    this.animatedSprite.gotoAndStop(0);
                    break;
                case PlayerDirection.UP:
                case PlayerDirection.LEFT:
                    this.animatedSprite.gotoAndStop(3);
                    break;
            }
            return;
        }
        const targetPosition = this.goto[0];
        const goX = this.position.x - targetPosition.x;
        const goY = this.position.y - targetPosition.y;

        const oldPosition = this.currentDirection;

        if(goY > 0)
            this.currentDirection = PlayerDirection.UP
        if(goY < 0)
            this.currentDirection = PlayerDirection.DOWN
        if(goX > 0)
            this.currentDirection = PlayerDirection.LEFT
        if(goX < 0)
            this.currentDirection = PlayerDirection.RIGHT

        this.addPosition(
            goX === 0 ? 0 : (goX > 0 ? - delta : delta),
            goY === 0 ? 0 : (goY > 0 ? - delta : delta)
        );

        if(oldPosition === this.currentDirection && this.animatedSprite.playing) return;
        switch (this.currentDirection) {
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

    public _onFrameChange = (frame: number) => {
        if(!this.animatedSprite.playing) return;

        switch (frame) {
            case 3:
                return this.animatedSprite.gotoAndPlay(1);
            case 0:
                return this.animatedSprite.gotoAndPlay(4);
        }
    }
}