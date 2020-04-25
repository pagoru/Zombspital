
import * as PIXI from 'pixi.js';
import EventEmitter = PIXI.utils.EventEmitter;
import {Key} from 'ts-key-enum';

export class Keyboard {

    private events: EventEmitter;

    constructor() {
        this.events = new EventEmitter();
    }

    private onKeyDown = (keyboardEvent: KeyboardEvent) => {
        keyboardEvent.preventDefault();
        this.events.emit('*', { code: keyboardEvent.code, key: keyboardEvent.key, isDown: true });
    };

    private onKeyUp = (keyboardEvent: KeyboardEvent) => {
        keyboardEvent.preventDefault();
        this.events.emit('*', { code: keyboardEvent.code, key: keyboardEvent.key, isDown: false });
    };

    public on(fn: (data: {code: string, key: Key | string, isDown: boolean}) => void) {
        this.events.on('*', fn);
    };

    public removeListener(fn: Function) {
        this.events.removeListener('*', fn)
    }

    public start() {
        window.addEventListener('keydown', this.onKeyDown, false);
        window.addEventListener('keyup', this.onKeyUp, false);
    }

    public stop() {
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
    }
    /*
    let text = '';
    const fn = ({ key, code, isDown }) => {
        if(!isDown) return;
        console.log(key, code);
        switch (code) {
            case 'KeyK':
                text += key;
                console.log(text);
                break;
            case Key.Backspace:
                text = text.substr(0, text.length - 1);
                console.log(text);
                break;
        }
    };
    this.keyboard.on(fn);
    this.keyboard.removeListener(fn);
     */

}
