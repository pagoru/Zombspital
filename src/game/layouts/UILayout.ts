
import * as PIXI from 'pixi.js';
import {ScoreInterface} from "./interfaces/ScoreInterface";
import {Game} from "../Game";

export class UILayout extends PIXI.Container {

    public scoreInterface: ScoreInterface;

    constructor() {
        super();
        this.zIndex = Number.MAX_SAFE_INTEGER;
    }

    public load = () => {
        this.scoreInterface = new ScoreInterface();
        this.addChild(this.scoreInterface);
    }

    public hide = () => Game.instance.canvas.stage().removeChild(this);
    public show = () => Game.instance.canvas.stage().addChild(this);

}