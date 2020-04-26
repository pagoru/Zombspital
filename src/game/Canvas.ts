
import * as PIXI from 'pixi.js';
import * as Stats from "stats.js";
import {TextureLoader} from "./TextureLoader";
import {CanvasEvents} from "./types/CanvasEvents";
import {PlayGroundLayout} from "./layouts/PlayGroundLayout";
import {UILayout} from "./layouts/UILayout";
import {GlitchFilter} from '@pixi/filter-glitch';
import {Camera} from "./Camera";

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

    public readonly filter: GlitchFilter;

    private readonly statsList: Array<Stats>;

    // private readonly insertCoinScreen: InsertCoinScreen;
    public readonly uiLayout: UILayout;
    public readonly playGroundLayout: PlayGroundLayout;

    private addedDelta4: number = 0;
    private addedDelta8: number = 0;

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
        this.camera = new Camera();
        document.body.appendChild(this.view());
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        this.filter = new GlitchFilter();
        this.filter.slices = 0;
        this.filter.red = new PIXI.Point(4, 0);
        this.filter.blue = new PIXI.Point(4, 0);

        this.stage().filters = [this.filter];

        this.textures = new TextureLoader();

        this.statsList = new Array<Stats>();

        this.uiLayout = new UILayout();
        // this.insertCoinScreen = new InsertCoinScreen();
        this.playGroundLayout = new PlayGroundLayout();

        this.load();
    }

    private load = async () => {
        await this.textures.load();

        this.loadStats();
        this.app.ticker.add(this.loop);

        this.uiLayout.load();
        this.playGroundLayout.load();
        this.stage().addChild(
            this.playGroundLayout,
            this.uiLayout
        );
    }

    private updateFilter = () => {
        this.filter.seed = Math.random()
        // this.filter.slices = Math.random() * 1000;
    }

    private loop = async (delta: number) => {
        const devStats = this.statsList;
        devStats.forEach(stat => stat.begin());
        // 60 fps loop
        this.emit("loop", delta);

        // 15 fps loop
        this.addedDelta8 += (delta / 8);
        if(this.addedDelta8 > 1) {
            const truncatedDelta = Math.trunc(delta);
            this.emit("loop8", truncatedDelta);
            this.addedDelta8 -= truncatedDelta;

            this.updateFilter();
        }

        // 30 fps loop
        this.addedDelta4 += (delta / 4);
        if(this.addedDelta4 > 1) {
            const truncatedDelta = Math.trunc(delta);
            this.emit("loop4", truncatedDelta);
            this.addedDelta4 -= truncatedDelta;
        }

        devStats.forEach(stat => stat.end());
    }

    private loadStats = () => {
        for (let i = 0; i < 3; i++) {
            const stats = new Stats();
            stats.dom.style.left = `${80 * i + 8}px`;
            stats.dom.style.right = ``;
            stats.dom.style.top = ``;
            stats.dom.style.bottom = `${8}px`;
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