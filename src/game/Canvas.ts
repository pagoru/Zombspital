
import * as PIXI from 'pixi.js';
import * as Stats from "stats.js";
import {TextureLoader} from "./TextureLoader";
import {Camera} from "./Camera";
import {CanvasEvents} from "./types/CanvasEvents";
import {InsertCoinScreen} from "./screens/InsertCoinScreen";
import {PlayGroundScreen} from "./screens/PlayGroundScreen";

export class Canvas extends PIXI.utils.EventEmitter {

    public static readonly SIZE = { w: 280, h: 192 };
    public static readonly SCALE = new PIXI.Point(2, 2);
    public static readonly SCALED_SIZE = {
        w: Canvas.SIZE.w / Canvas.SCALE.x,
        h: Canvas.SIZE.h / Canvas.SCALE.y
    }

    public static readonly SCREEN_SCALE = new PIXI.Point(4, 4);

    public readonly app: PIXI.Application;
    public readonly textures: TextureLoader;
    public readonly camera: Camera;

    private readonly statsList: Array<Stats>;

    private readonly insertCoinScreen: InsertCoinScreen;
    private readonly playGroundScreen: PlayGroundScreen;

    constructor() {
        super();
        this.app = new PIXI.Application({
            width: Canvas.SIZE.w * Canvas.SCREEN_SCALE.x,
            height: Canvas.SIZE.h * Canvas.SCREEN_SCALE.y,
            backgroundColor: 0x000000,
            antialias: true,
            resolution: 1,
            autoDensity: true
        });
        this.stage().sortableChildren = true;
        this.stage().scale = new PIXI.Point(
            Canvas.SCALE.x * Canvas.SCREEN_SCALE.x,
            Canvas.SCALE.y * Canvas.SCREEN_SCALE.y
        );
        document.body.appendChild(this.view());
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        this.camera = new Camera();
        this.textures = new TextureLoader();

        this.statsList = new Array<Stats>();

        this.insertCoinScreen = new InsertCoinScreen();
        this.playGroundScreen = new PlayGroundScreen();

        this.load();
    }

    private load = async () => {
        await this.textures.load();
        await this.camera.load();

        this.loadStats();
        this.app.ticker.add(this.loop);

        this.insertCoinScreen.load();
        this.playGroundScreen.load();
        this.stage().addChild(this.playGroundScreen, this.insertCoinScreen);
    }
    private addedDelta: number = 0;

    private loop = async (delta: number) => {
        const devStats = this.statsList;
        devStats.forEach(stat => stat.begin());

        // normal loop
        this.emit("loop", delta);

        // 15 fps loop
        this.addedDelta += (delta / 8);
        if(this.addedDelta > 1) {
            const truncatedDelta = Math.trunc(delta);
            this.emit("loop15", truncatedDelta);
            this.addedDelta -= truncatedDelta;
        }

        devStats.forEach(stat => stat.end());
    }

    private loadStats = () => {
        for (let i = 0; i < 3; i++) {
            const stats = new Stats();
            stats.dom.style.left = '';
            stats.dom.style.right = `${80 * i + 8}px`;
            stats.dom.style.top = `${8}px`;
            stats.dom.style.bottom = ``;
            stats.showPanel(i);
            this.statsList.push(stats);
            document.body.appendChild(stats.dom)
        }
    }

    public view = (): HTMLCanvasElement => this.app.view;
    public stage = (): PIXI.Container => this.app.stage;
    public renderer = (): PIXI.Renderer => this.app.renderer

    public on(event: CanvasEvents, fn: Function): this {
        return super.on(event, fn);
    }

    public emit(event: CanvasEvents, data: any): boolean {
        return super.emit(event, data);
    }

}