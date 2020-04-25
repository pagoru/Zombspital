import {Canvas} from "./Canvas";
import {Camera} from "./Camera";
import {VERSION} from "./types/Constants";
import {Keyboard} from "./Keyboard";

export class Game {

    public static instance: Game;

    public readonly version: string;
    public readonly canvas: Canvas;
    public readonly keyboard: Keyboard;

    constructor() {
        this.version = VERSION;
        this.canvas = new Canvas();
        this.keyboard = new Keyboard();
    }

    start = () => {
        this.keyboard.start();
    }

}