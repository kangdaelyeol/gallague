import { GameObject } from './GameObject.js'

//this class will extend the GameObject's inherent class properties
export class Movable extends GameObject {
    constructor(x, y, width, height, path, type) {
        super(x, y, width, height, path, type)
    }

    //this movable object can be moved on the screen
    moveTo(x, y) {
        this.x = x
        this.y = y
    }
}
