
import * as PIXI from 'pixi.js';
import {Game} from "../Game";
import {Player} from "./playground/entities/Player";
import {PlayerType} from "../types/PlayerType";
import {MapType} from "../types/MapType";
import {Zombie} from "./playground/entities/Zombie";
import {Utils} from "../Utils";
import {CakeEntity} from "./playground/entities/CakeEntity";
import {ObjectEntity} from "./playground/entities/ObjectEntity";
import GetRandomNumber = Utils.GetRandomNumber;

export class PlayGroundLayout extends PIXI.Container {

    private player1: Player;
    private player2: Player;

    private readonly map: MapType;
    private currentRoomPosition: PIXI.Point;

    private requestedAddedPosition: PIXI.Point;

    private currentPathRoomBounds: Array<Array<number>>;

    private objectEntityList: Array<ObjectEntity>;
    private zombieList: Array<Zombie>;

    constructor() {
        super();
        this.map = require('../../assets/map.json');
        this.sortableChildren = true;
        this.currentRoomPosition = new PIXI.Point(0, 0);
        this.objectEntityList = new Array<ObjectEntity>();
        this.zombieList = new Array<Zombie>();
    }

    public load = () => {
        this.loadMap();

        this.player1 = new Player('solo');
        this.player1.addPosition(20, 20, true);

        const cake = new CakeEntity();
        cake.setPosition(30, 40);
        this.addObjectEntity(cake);

        this.addChild(this.player1);

        Game.instance.canvas.on("loop", this.loop);
    }

    public addObjectEntity = (object: ObjectEntity) => {
        this.addChild(object);
        this.objectEntityList.push(object);
    }
    public destroyObjectEntity = (object: ObjectEntity) => {
        this.removeChild(object);
        this.objectEntityList = this.objectEntityList.filter(o => o.id !== object.id);
    }

    public addZombie = (zombie: Zombie) => {
        this.addChild(zombie);
        this.zombieList.push(zombie);
    }
    public destroyZombie = (zombie: Zombie) => {
        this.removeChild(zombie);
        this.objectEntityList = this.objectEntityList.filter(o => o.id !== zombie.id);
    }

    public destroyAllZombiesAndPerks = () => {
        console.log('zombies and perks dead')
        this.removeChild(...this.objectEntityList, ...this.zombieList);
        this.objectEntityList = [];
        this.zombieList = [];
    }

    private generateZombiesAndPerks = () => {
        const initialPosition = this.getCurrentRoomPositionCorrected();

        const players = this.getPlayers();
        let zombiefication = players.length === 0 ? -1 : players.map(p => p.getZombiefication()).reduce((c, z) => c + z) / players.length;

        const zombiesNumber = GetRandomNumber(Math.trunc(zombiefication / 10), Math.trunc(zombiefication / 3));

        for (let i = 0; i < zombiesNumber; i++) {
            const zombie = new Zombie(Utils.GetRandomNumber(0, 3) === 1);
            const randomSpot = this.getRandomFreeSpot();
            zombie.addPosition(initialPosition.x + randomSpot.x,initialPosition.y + randomSpot.y, true);
            this.addZombie(zombie)
        }
    }

    private getRandomFreeSpot = () => {
        const currentRoomBounds = this.getCurrentRoomBounds();
        const randomPoint = new PIXI.Point(
            GetRandomNumber(0, currentRoomBounds[0].length - 1),
            GetRandomNumber(0, currentRoomBounds.length - 1)
        );
        const isEmpty = currentRoomBounds[randomPoint.y][randomPoint.x] === 0;
        return isEmpty ?  new PIXI.Point(
            randomPoint.x * 16 + GetRandomNumber(0, 15),
            randomPoint.y * 16 + GetRandomNumber(0, 15)
        ) : this.getRandomFreeSpot();
    }

    public loadPlayer2 = () => {
        if(this.player2 || !Game.instance.canvas.uiLayout.scoreInterface.canP2Spawn()) return;
        const pos = this.player1.position;
        const zombiefication = this.player1.getZombiefication();
        this.removeChild(this.player1);

        this.player1 = new Player('p1');
        this.player1.addZombiefication(zombiefication);
        this.player1.addPosition(pos.x, pos.y, true);

        this.player2 = new Player('p2');
        this.player2.addPosition(pos.x, pos.y, true);
        this.addChild(this.player1, this.player2);

        Game.instance.canvas.uiLayout.scoreInterface.removeSecondPlayerText();
    }

    public loop = () => {
        const requestChangeRoomPlayer1 = this.player1.getRequestChangeRoom();
        switch (this.player1.type) {
            case "solo":
                if(requestChangeRoomPlayer1)
                    this.loadRoom(requestChangeRoomPlayer1);
                break;
            case "p1":
                const requestChangeRoomPlayer2 = this.player2.getRequestChangeRoom();
                if(this.player1.isDead() && this.player2.isDead())
                    this.requestedAddedPosition = null;
                else if((requestChangeRoomPlayer1 || this.player1.isDead()) && (requestChangeRoomPlayer2 || this.player2.isDead()))
                    this.loadRoom(this.player1.isDead() ? requestChangeRoomPlayer2 : requestChangeRoomPlayer1);
                break;
        }
        if(this.requestedAddedPosition) {
            this.currentRoomPosition = new PIXI.Point(
                this.requestedAddedPosition.x + this.currentRoomPosition.x,
                this.requestedAddedPosition.y + this.currentRoomPosition.y
            );
            this.loadMap();
            Game.instance.canvas.camera.move(this.currentRoomPosition);
            this.requestedAddedPosition = null;
        }
    }

    private loadMap = () => {
        const roomPosition = this.getCurrentRoomPositionCorrected();
        // this.removeChild(...this.children.filter(c => c.name === 'tile'));
        this.getCurrentRoom().tiles.forEach((arrX, y) => {
            arrX.forEach((tile, x) => {
                if(tile === -1) return;
                const _tileBlock = new PIXI.Sprite(Game.instance.canvas.textures.getTexture(`tile_${tile}`));
                _tileBlock.name = 'tile'
                _tileBlock.position.set(roomPosition.x + x * 16, roomPosition.y + y * 16);
                _tileBlock.zIndex = _tileBlock.position.y - (tile === 0 ? 32 : 0) + 16;
                this.addChild(_tileBlock);
            });
        });
        // Lol, try to understand this... lollollololololololololololololololololol :'D
        this.currentPathRoomBounds =
            Array.from(Array(this.getCurrentRoomBounds().length * 16).keys())
                .map((y) => this.getCurrentRoomBounds()[Math.trunc(y / 16)]
                .map(t => Array.from(Array(16).keys()).map(_ => t).flat(2) ).flat(2));
        this.generateZombiesAndPerks();
    }

    public loadRoom = (addPosition: PIXI.Point) => {
        if(this.requestedAddedPosition) return;

        const candidate = new PIXI.Point(
            addPosition.x + this.currentRoomPosition.x,
            addPosition.y + this.currentRoomPosition.y
        );
        if(!this.findRoom(candidate)) return;
        this.destroyAllZombiesAndPerks();
        this.requestedAddedPosition = addPosition;
        if(!this.player1.isDead())
            this.player1.addPosition(addPosition.x * 2, addPosition.y * 2, true);
        if(this.player2 && !this.player2.isDead())
            this.player2.addPosition(addPosition.x * 2, addPosition.y * 2, true);
    }

    public getCurrentRoomPositionCorrected = () => new PIXI.Point(
        this.currentRoomPosition.x * 9 * 16,
        this.currentRoomPosition.y * 6 * 16
    );
    public getCurrentRoomMaxPositionCorrected = () => {
        const current = this.getCurrentRoomPositionCorrected();
        return new PIXI.Point(current.x + (9 * 16), current.y + (6 * 16))
    }
    public getCurrentRoomPosition = () => this.currentRoomPosition;
    public getCurrentRoom = () => this.findRoom(this.currentRoomPosition);

    public findRoom = (position: PIXI.Point) => this.map
        .find(room => position.x === room.x && position.y === room.y);

    public getCurrentRoomBounds = () => this.getCurrentRoom().tiles
        .map(arrX => arrX.map(tile => tile === 0 ? 0 : 1));

    public getCurrentPathRoomBounds = () => this.currentPathRoomBounds;

    public killPlayer = (type: PlayerType) => {
        switch (type) {
            case "solo":
            case "p1":
                this.removeChild(this.player1);
                break;
            case "p2":
                this.removeChild(this.player2);
                break;
        }
    }

    public arePlayersDead = () => this.getPlayers().length === 0;
    public getPlayers = () => [this.player1, this.player2].filter(p => p && !p.isDead());

    public getCollidingObjectEntities = (position: PIXI.IPoint) =>
        this.objectEntityList.find(oe => oe.position.x + oe.width > position.x
            && oe.position.x < position.x
            && oe.position.y + oe.height > position.y
            && oe.position.y < position.y
        );

}