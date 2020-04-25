import {Entity} from "./Entity";
import {Game} from "../../../Game";

export class Zombie extends Entity {

    constructor() {
        super(Game.instance.canvas.textures.getZombieTextures());
    }

}