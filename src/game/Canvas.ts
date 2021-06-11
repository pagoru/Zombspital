
import * as PIXI from 'pixi.js';
import PIXISound from 'pixi-sound';
import * as Stats from "stats.js";
import {TextureLoader} from "./TextureLoader";
import {CanvasEvents} from "./types/CanvasEvents";
import {PlayGroundLayout} from "./layouts/PlayGroundLayout";
import {UILayout} from "./layouts/UILayout";
import {GlitchFilter} from '@pixi/filter-glitch';
import {Camera} from "./Camera";
import {InsertCoinInterface} from "./layouts/interfaces/InsertCoinInterface";
import {GameOverInterface} from "./layouts/interfaces/GameOverInterface";

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

    public readonly insertCoinInterface: InsertCoinInterface;
    public readonly uiLayout: UILayout;
    public readonly playGroundLayout: PlayGroundLayout;
    public readonly gameOverInterface: GameOverInterface;

    private addedDelta4: number = 0;
    private addedDelta8: number = 0;

    public soundTheme: any;

    constructor() {
        super();
        this.app = new PIXI.Application({
            width: Canvas.SIZE.w * Canvas.SCREEN_SCALE.x,
            height: Canvas.SIZE.h * Canvas.SCREEN_SCALE.y,
            backgroundColor: 0xFFFFFF,
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
        this.insertCoinInterface = new InsertCoinInterface();
        this.playGroundLayout = new PlayGroundLayout();
        this.gameOverInterface = new GameOverInterface();
        this.loadSplash();
    }

    private loadSplash = async () => {
        this.app.ticker.add(this.loop);

        await this.textures.load();

        // this.load();
        const splash = new PIXI.Sprite(this.textures.getTexture('splash'));
        splash.alpha = 0;
        splash.position.set(
            Math.trunc(Canvas.SCALED_SIZE.w / 2 - splash.width / 2),
            Math.trunc(Canvas.SCALED_SIZE.h / 2 - splash.height / 2)
        )
        let pos = 0;
        const loop8 = () => {
            switch (pos) {
                case 0:
                    splash.alpha += 0.125;
                    if(splash.alpha > 3)
                        pos = 1;
                    break;
                case 1:
                    splash.alpha -= 0.25;
                    if(splash.alpha < -3)
                        pos = 2;
                    break;
                case 2:
                    this.removeListener('loop8', loop8);
                    this.renderer().backgroundColor = 0x000000;
                    this.load();
                    break;
            }
        }
        this.on('loop8', loop8);
        this.stage().addChild(splash);
    }

    private load = async () => {
        this.soundTheme = PIXISound.Sound.from(require('../assets/theme.mp3').default);
        this.soundTheme.loop = true;
        this.soundTheme.volume = 0.125;
        this.soundTheme.play();

        // this.loadStats();

        this.uiLayout.load();
        this.playGroundLayout.firstLoad();
        this.insertCoinInterface.load();
        this.gameOverInterface.load();

        this.stage().addChild(this.playGroundLayout, this.gameOverInterface);
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
        this.addedDelta8 += delta / 8;
        let truncatedDelta = Math.trunc(this.addedDelta8);
        if(truncatedDelta > 0) {
            this.addedDelta8 -= truncatedDelta;
            this.emit("loop8", truncatedDelta);
            this.updateFilter();
        }

        // 30 fps loop
        this.addedDelta4 += delta / 4;
        let truncatedDelta2 = Math.trunc(this.addedDelta4);
        if(truncatedDelta2 > 0) {
            this.addedDelta4 -= truncatedDelta2;
            this.emit("loop4", truncatedDelta2);
            this.updateFilter();
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