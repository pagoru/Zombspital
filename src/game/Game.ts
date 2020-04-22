import {Canvas} from "./Canvas";
import {Camera} from "./Camera";
import {VERSION} from "./types/Constants";

export class Game {

    public static instance: Game;

    public readonly version: string;

    public readonly canvas: Canvas;

    constructor() {
        this.version = VERSION;
        this.canvas = new Canvas();
    }

    start = () => {
    }

}