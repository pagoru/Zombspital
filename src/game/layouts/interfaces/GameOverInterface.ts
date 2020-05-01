import * as PIXI from "pixi.js";
import {Game} from "../../Game";
import {Canvas} from "../../Canvas";
import PIXISound from 'pixi-sound';

export class GameOverInterface extends PIXI.Container {

    private gameOver: PIXI.Sprite;

    constructor() {
        super();
        this.zIndex = Number.MAX_SAFE_INTEGER;
    }

    public load = () => {
        this.gameOver = new PIXI.Sprite(Game.instance.canvas.textures.getTexture('text_gameover'));
        this.gameOver.position.set(
            Math.trunc(Canvas.SCALED_SIZE.w / 2 - this.gameOver.width / 2),
            Math.trunc(Canvas.SCALED_SIZE.h / 2 - this.gameOver.height / 2)
        )
    }

    show() {
        this.addChild(this.gameOver);

        Game.instance.canvas.soundTheme.pause();
        Game.instance.canvas.soundTheme.speed = 1;

        const gameOverSound = PIXISound.Sound.from(require('../../../assets/gameover.mp3').default);
        gameOverSound.volume = 0.125;
        gameOverSound.play();

        setTimeout(() => {
            this.removeChild(this.gameOver);
            Game.instance.canvas.soundTheme.resume();
            Game.instance.canvas.insertCoinInterface.show();
            Game.instance.canvas.uiLayout.hide();
            Game.instance.canvas.uiLayout.scoreInterface.reset();
        }, 5000);
    };


}