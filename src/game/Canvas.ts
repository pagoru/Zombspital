
import * as PIXI from 'pixi.js';
import * as Stats from "stats.js";
import {TextureLoader} from "./TextureLoader";
import {Camera} from "./Camera";

export class Canvas {

    public readonly app: PIXI.Application;
    public readonly textures: TextureLoader;
    public readonly camera: Camera;

    private readonly statsList: Array<Stats>;

    constructor() {
        this.app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0xFFFFFF,
            antialias: true,
            resolution: 1,
            autoDensity: true
        });
        this.stage().sortableChildren = true;
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        document.body.appendChild(this.view());

        this.camera = new Camera();
        this.textures = new TextureLoader();

        this.statsList = new Array<Stats>();

        this.load();
    }

    private load = async () => {
        await this.textures.load();
        await this.camera.load();

        this.loadStats();
        this.app.ticker.add(this.loop);

        const sprite = new PIXI.Sprite(this.textures.spriteSheet.textures['logo']);
        sprite.scale = new PIXI.Point(4, 4);

        this.stage().addChild(sprite)
    }

    private loop = async (delta: number) => {
        const devStats = this.statsList;
        devStats.forEach(stat => stat.begin());

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

}