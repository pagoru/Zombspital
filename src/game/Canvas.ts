
import * as PIXI from 'pixi.js';
import * as Stats from "stats.js";
import {TextureLoader} from "./TextureLoader";
import {Camera} from "./Camera";

export class Canvas {

    public static readonly SIZE = { w: 280, h: 192 };
    public static readonly SCALE = new PIXI.Point(2, 2);
    public static readonly SCALED_SIZE = {
        w: Canvas.SIZE.w / Canvas.SCALE.x,
        h: Canvas.SIZE.h / Canvas.SCALE.y
    }

    public readonly app: PIXI.Application;
    public readonly textures: TextureLoader;
    public readonly camera: Camera;

    private readonly statsList: Array<Stats>;

    constructor() {
        this.app = new PIXI.Application({
            width: Canvas.SIZE.w * 4,
            height: Canvas.SIZE.h * 4,
            // width: window.innerWidth,
            // height: window.innerHeight,
            backgroundColor: 0xFFFFFF,
            antialias: true,
            resolution: 1,
            autoDensity: true
        });
        this.stage().sortableChildren = true;
        this.stage().scale = new PIXI.Point(8, 8)
        document.body.appendChild(this.view());
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        this.camera = new Camera();
        this.textures = new TextureLoader();

        this.statsList = new Array<Stats>();

        this.load();
    }

    private logo: PIXI.Sprite;
    private insertCoin: PIXI.Sprite;

    private load = async () => {
        await this.textures.load();
        await this.camera.load();

        this.loadStats();
        this.app.ticker.add(this.loop);

        this.logo = new PIXI.Sprite(this.textures.spriteSheet.textures['logo']);
        this.logo.pivot.set(this.logo.width / 2, this.logo.height / 2 - 10);
        this.logo.position.set(Canvas.SCALED_SIZE.w / 2, this.logo.height / 2)

        this.insertCoin = new PIXI.Sprite(this.textures.spriteSheet.textures['insertCoin']);
        this.insertCoin.pivot.set(this.insertCoin.width / 2, this.insertCoin.height / 2);
        this.insertCoin.position.set(Canvas.SCALED_SIZE.w / 2, Canvas.SCALED_SIZE.h / 2 + 30)

        this.stage().addChild(this.logo, this.insertCoin)
    }

    private logoDirection: 'down' | 'up' = 'down';
    private logoYPosition: number = 0;

    private insertCoinAlpha: 'show' | 'hide' = 'show';

    private loop = async (delta: number) => {
        delta = Math.trunc(delta);
        const devStats = this.statsList;
        devStats.forEach(stat => stat.begin());

        switch (this.logoDirection) {
            case "down":
                this.logo.position.y += delta;
                this.logoYPosition += delta;
                if(this.logoYPosition > 5)
                    this.logoDirection = 'up';
                break;
            case "up":
                this.logo.position.y -= 1;
                this.logoYPosition -= 1;
                if(this.logoYPosition < 0)
                    this.logoDirection = 'down';
                break;
        }
        switch (this.insertCoinAlpha) {
            case "hide":
                this.insertCoin.alpha -= delta;
                if(0 >= this.insertCoin.alpha)
                    this.insertCoinAlpha = 'show'
                break;
            case "show":
                this.insertCoin.alpha += delta;
                if(this.insertCoin.alpha >= 1)
                    this.insertCoinAlpha = 'hide'
                break;
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

}