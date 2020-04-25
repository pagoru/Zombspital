
import * as PIXI from 'pixi.js';
import {ScoreInterface} from "./interfaces/ScoreInterface";

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

}