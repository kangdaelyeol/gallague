let movingL = false
let movingR = false
let movingU = false
let movingD = false
let dash = false
const MovingSpeed = 5
let hpDash = 1

//set up the class GameObject
class GameObject {
    constructor(x, y, width, height, path, type) {
        this.x = x
        this.y = y
        this.dead = false
        this.type = type
        this.width = width
        this.height = height
        this.img = path
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
    }
}

//this class will extend the GameObject's inherent class properties
class Movable extends GameObject {
    constructor(x, y, width, height, path, type) {
        super(x, y, width, height, path, type)
    }

    //this movable object can be moved on the screen
    moveTo(x, y) {
        this.x = x
        this.y = y
    }
}

//this is a specific class that extends the Movable class, so it can take advantage of all the properties that it inherits
export class Hero extends Movable {
    constructor(x, y, width, height, path) {
        super(x, y, width, height, path, 'hero')
    }

    active = (ctx) => {
        if (hpDash > 1) {
            hpDash /= 1.1
            console.log(hpDash)
        }
        // Padding X = 0
        let sp = dash ? MovingSpeed * 2 * hpDash : MovingSpeed
        sp = hpDash > 1 ? sp * hpDash : sp
        console.log(sp)
        if (movingL && this.x > sp) this.moveTo(this.x - sp, this.y)

        // 1400 (CanvasWidth)
        if (movingR && this.x < 1400 - this.width)
            this.moveTo(this.x + sp, this.y)

        if (movingD && this.y + this.height < 700)
            this.moveTo(this.x, this.y + sp)
        if (movingU && this.y > 0) this.moveTo(this.x, this.y - sp)
        this.draw(ctx)
    }
}

class Enemy extends Movable {
    constructor(x, y, width, height, path) {
        super(x, y, width, height, path)
        ;(this.width = 98), (this.height = 50)
        this.type = 'Enemy'
        let id = setInterval(() => {
            if (this.y < canvas.height - this.height) {
                this.y += 5
            } else {
                console.log('Stopped at', this.y)
                clearInterval(id)
            }
        }, 300)
    }
}

//set up an EventEmitter class that contains listeners
class EventEmitter {
    constructor() {
        this.listeners = {}
    }
    //when a message is received, let the listener to handle its payload
    on(message, listener) {
        if (!this.listeners[message]) {
            this.listeners[message] = []
        }
        this.listeners[message].push(listener)
    }
    //when a message is sent, send it to a listener with some payload
    emit(message, payload = null) {
        if (this.listeners[message]) {
            this.listeners[message].forEach((l) => l(message, payload))
        }
    }
}

//set up a message structure
const Messages = {
    HERO_MOVE_LEFT: 'HERO_MOVE_LEFT',
}
//invoke the eventEmitter you set up above
const eventEmitter = new EventEmitter()
//set up a hero
//let the eventEmitter know to watch for messages pertaining to the hero moving left, and act on it

//set up the window to listen for the keyup event, specifically if the left arrow is hit, emit a message to move the hero left
window.addEventListener('keydown', (evt) => {
    console.log(evt.key)
    switch (evt.key) {
        case 'ArrowLeft':
            movingL = true
            break
        case 'ArrowRight':
            movingR = true
            break
        case 'ArrowUp':
            movingU = true
            break
        case 'ArrowDown':
            movingD = true
            break
        case 'Shift':
            dash = true
            break
        case 'z':
        case 'Z':
            hpDash = 2.5
            break
    }
})

window.addEventListener('keyup', (evt) => {
    switch (evt.key) {
        case 'ArrowLeft':
            movingL = false
            break
        case 'ArrowRight':
            movingR = false
            break
        case 'ArrowUp':
            movingU = false
            break
        case 'ArrowDown':
            movingD = false
            break
        case 'Shift':
            dash = false
            break
    }
})
