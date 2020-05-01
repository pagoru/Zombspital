
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
import {BloodBagEntity} from "./playground/entities/BloodBagEntity";
import {ToiletPaperEntity} from "./playground/entities/ToiletPaperEntity";
import {SkullEntity} from "./playground/entities/SkullEntity";

export class PlayGroundLayout extends PIXI.Container {

    private player1: Player;
    private player2: Player;

    private readonly map: MapType;
    private currentRoomPosition: PIXI.Point;

    private requestedAddedPosition: PIXI.Point;

    private currentPathRoomBounds: Array<Array<number>>;

    private objectEntityList: Array<ObjectEntity>;
    private zombieList: Array<Zombie>;

    private firstTime: boolean;

    constructor() {
        super();
        this.map = require('../../assets/map.json');
        this.sortableChildren = true;
        this.currentRoomPosition = new PIXI.Point(0, 0);
        this.objectEntityList = new Array<ObjectEntity>();
        this.zombieList = new Array<Zombie>();
        this.firstTime = true;
    }

    public firstLoad = () => {
        this.requestedAddedPosition = this.getRandomRoom();
        Game.instance.canvas.on("loop", this.loop);
    }

    public load = () => {
        this.firstTime = false;
        this.requestedAddedPosition = this.getRandomRoom();
        Game.instance.canvas.uiLayout.show()
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
        this.removeChild(...this.objectEntityList, ...this.zombieList);
        this.objectEntityList = [];
        this.zombieList = [];
    }

    private generateZombiesAndPerks = () => {

        const players = this.getPlayers();
        let zombiefication = players.length === 0 ? 1 : players.map(p => p.getZombiefication()).reduce((c, z) => c + z) / players.length;

        // zombie
        const zombiesNumber = GetRandomNumber(Math.trunc(zombiefication / 7), Math.trunc(zombiefication / 3));
        for (let i = 0; i < (!this.firstTime ? zombiesNumber : 5); i++) {
            const zombie = new Zombie(Utils.GetRandomNumber(0, 3) === 1);
            const randomSpot = this.getRandomFreeSpot();
            zombie.addPosition(randomSpot.x,randomSpot.y, true);
            this.addZombie(zombie)
        }

        // blood bags
        const bloodBagNumber = GetRandomNumber(0, 2 * players.length + 1);
        const bloodMin = GetRandomNumber(
            Math.trunc((100 - zombiefication) / 10),
            Math.trunc(zombiefication / 5)
        );
        for (let i = 0; i < (!this.firstTime ? bloodBagNumber : 2); i++) {
            const bloodBag = new BloodBagEntity(bloodMin, 50);
            bloodBag.setPosition(this.getRandomFreeSpot());
            this.addObjectEntity(bloodBag);
        }

        // cakes
        if(GetRandomNumber(0, 100) === 4 || this.firstTime) {
            const cake = new CakeEntity();
            cake.setPosition(this.getRandomFreeSpot());
            this.addObjectEntity(cake);
        }

        // toilet paper
        for (let i = 0; i < (!this.firstTime ? GetRandomNumber(0, 3) : 10 ); i++) {
            const toiletPaper = new ToiletPaperEntity();
            toiletPaper.setPosition(this.getRandomFreeSpot());
            this.addObjectEntity(toiletPaper);
        }

        // voidpixel skull
        if(GetRandomNumber(0, 50) === 4 || this.firstTime) {
            const cake = new SkullEntity();
            cake.setPosition(this.getRandomFreeSpot());
            this.addObjectEntity(cake);
        }

    }

    private getRandomRoom = () => {
        const room = new PIXI.Point(
            GetRandomNumber(0, this.map.map(r => r.x).reduce((a, x) => a = a > x ? a : x)),
            GetRandomNumber(0, this.map.map(r => r.y).reduce((a, y) => a = a > y ? a : y))
        );
        return this.firstTime
            ? room
            : new PIXI.Point(room.x - this.currentRoomPosition.x, room.y - this.currentRoomPosition.y)
    }

    private getRandomFreeSpot = () => {
        const initialPosition = this.getCurrentRoomPositionCorrected();
        const currentRoomBounds = this.getCurrentRoomBounds();
        const randomPoint = new PIXI.Point(
            GetRandomNumber(0, currentRoomBounds[0].length - 1),
            GetRandomNumber(0, currentRoomBounds.length - 1)
        );
        const isEmpty = currentRoomBounds[randomPoint.y][randomPoint.x] === 0;
        return isEmpty ?  new PIXI.Point(
            initialPosition.x + randomPoint.x * 16 + GetRandomNumber(0, 15),
            initialPosition.y + randomPoint.y * 16 + GetRandomNumber(0, 15)
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

    private gameOver = () => {
        this.player1 = null;
        this.player2 = null;

        Game.instance.canvas.gameOverInterface.show();
    }

    public loop = () => {
        if(this.player1 && this.arePlayersDead() && !this.firstTime)
            return this.gameOver();

        if(this.player1) {
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
        }
        if(!this.requestedAddedPosition) return;

        this.currentRoomPosition = new PIXI.Point(
            this.requestedAddedPosition.x + this.currentRoomPosition.x,
            this.requestedAddedPosition.y + this.currentRoomPosition.y
        );
        this.loadMap();
        Game.instance.canvas.camera.move(this.currentRoomPosition);
        this.requestedAddedPosition = null;

        if(this.player1 || this.firstTime) return;

        const randomPlayerPos = this.getRandomFreeSpot();

        this.player1 = new Player('solo');
        this.player1.addPosition(randomPlayerPos.x, randomPlayerPos.y, true);

        const cake = new CakeEntity();
        cake.setPosition(this.getRandomFreeSpot());
        this.addObjectEntity(cake);

        this.addChild(this.player1);
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

    public getCollidingPlayers = (position: PIXI.IPoint) =>
        this.getPlayers().find(oe => oe.position.x + 4 > position.x
            && oe.position.x - 4 < position.x
            && oe.position.y + 2 > position.y
            && oe.position.y - 2 < position.y
        );

}